/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  featuredCollections,
  mockCategories,
  mockTestimonials,
} from "../data/mockStore";
import { auth, db, doc, getDocs, collection, setDoc, deleteDoc, query, where } from "../Firebase/firebase.config";
import { onAuthStateChanged } from "firebase/auth";

const initialStore = {
  currentUser: null,
  products: [],
  addresses: [],
  cartItems: [],
  orders: [],
};

const StoreContext = createContext(null);

export const StoreProvider = ({ children }) => {
  const [store, setStore] = useState(initialStore);

  // Fetch global products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, "products"));
        const fetchedProducts = productsSnapshot.docs.map((d) => d.data());
        setStore((prev) => ({ ...prev, products: fetchedProducts }));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // 1. Create or update user profile globally
          const userDocRef = doc(db, "users", user.uid);
          const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || user.email?.split("@")[0],
          };
          await setDoc(userDocRef, userData, { merge: true });

          // 2. Fetch User specific collections
          const cartSnapshot = await getDocs(collection(userDocRef, "cartItems"));
          const cartItems = cartSnapshot.docs.map((d) => d.data());

          const addressesSnapshot = await getDocs(collection(userDocRef, "addresses"));
          const addresses = addressesSnapshot.docs.map((d) => d.data());

          // 3. Fetch User orders from the global orders collection
          const q = query(collection(db, "orders"), where("userId", "==", user.uid));
          const ordersSnapshot = await getDocs(q);
          const orders = ordersSnapshot.docs.map((d) => d.data());

          // Sort orders by createdAt descending since it's a string ISO date
          orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          setStore((prev) => ({
            ...prev,
            currentUser: userData,
            cartItems,
            orders,
            addresses,
          }));
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setStore((prev) => ({
          ...initialStore,
          products: prev.products, // Keep global products loaded
        }));
      }
    });

    return () => unsubscribe();
  }, []);

  const setCurrentUser = (user) => {
    setStore((prev) => ({ ...prev, currentUser: user }));
  };

  const login = () => {}; // Handled directly in LoginSignup via Firebase Auth

  const logout = async () => {
    await auth.signOut();
    setStore((prev) => ({ ...initialStore, products: prev.products }));
  };

  const addToCart = async (product) => {
    if (!store.currentUser) return; // Alternatively, prompt login

    let newCartItems = [...store.cartItems];
    const existing = newCartItems.find((item) => item.productId === product._id);

    try {
      if (existing) {
        newCartItems = newCartItems.map((item) =>
          item.productId === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
        const updatedItem = newCartItems.find((item) => item.productId === product._id);
        await setDoc(doc(db, "users", store.currentUser.uid, "cartItems", updatedItem._id), updatedItem);
      } else {
        const newItem = {
          _id: `cart-${Date.now()}`,
          productId: product._id,
          title: product.title,
          image: product.image,
          category: product.category,
          price: product.price,
          quantity: 1,
        };
        newCartItems.push(newItem);
        await setDoc(doc(db, "users", store.currentUser.uid, "cartItems", newItem._id), newItem);
      }
      setStore((prev) => ({ ...prev, cartItems: newCartItems }));
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const updateCartQuantity = async (id, quantity) => {
    if (!store.currentUser) return;

    try {
      const newQty = Math.max(1, quantity);
      const newCartItems = store.cartItems.map((item) =>
        item._id === id ? { ...item, quantity: newQty } : item
      );

      const updatedItem = newCartItems.find((item) => item._id === id);
      if (updatedItem) {
        await setDoc(doc(db, "users", store.currentUser.uid, "cartItems", id), updatedItem);
      }

      setStore((prev) => ({ ...prev, cartItems: newCartItems }));
    } catch (error) {
      console.error("Error updating cart quantity:", error);
    }
  };

  const removeFromCart = async (id) => {
    if (!store.currentUser) return;

    try {
      await deleteDoc(doc(db, "users", store.currentUser.uid, "cartItems", id));
      setStore((prev) => ({
        ...prev,
        cartItems: prev.cartItems.filter((item) => item._id !== id),
      }));
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  const placeOrder = async (formData) => {
    if (!store.currentUser) return;

    try {
      const total = store.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const newOrder = {
        _id: `order-${Date.now()}`,
        userId: store.currentUser.uid,
        ...formData,
        total,
        status: "Confirmed",
        createdAt: new Date().toISOString(),
        cartItems: store.cartItems,
      };

      // Save order globally
      await setDoc(doc(db, "orders", newOrder._id), newOrder);

      // Save address if new
      const addressExists = store.addresses.some(
        (address) =>
          address.address === formData.address &&
          address.city === formData.city &&
          address.pincode === formData.pincode
      );

      let newAddresses = store.addresses;
      if (!addressExists) {
        const newAddress = {
          _id: `addr-${Date.now()}`,
          type: "Saved",
          address: formData.address,
          city: formData.city,
          pincode: formData.pincode,
        };
        await setDoc(doc(db, "users", store.currentUser.uid, "addresses", newAddress._id), newAddress);
        newAddresses = [newAddress, ...store.addresses];
      }

      // Clear cart in firestore
      for (const item of store.cartItems) {
        await deleteDoc(doc(db, "users", store.currentUser.uid, "cartItems", item._id));
      }

      setStore((prev) => ({
        ...prev,
        cartItems: [],
        orders: [newOrder, ...prev.orders],
        addresses: newAddresses,
      }));

      return newOrder;
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const resetDemo = () => {
    setStore((prev) => ({ ...initialStore, products: prev.products }));
  };

  const value = {
    ...store,
    categories: mockCategories,
    testimonials: mockTestimonials,
    featuredCollections,
    login,
    logout,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    placeOrder,
    resetDemo,
    setCurrentUser,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return context;
};
