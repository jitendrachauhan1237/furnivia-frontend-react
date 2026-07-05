import React, { useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useScrollToTop from "../hooks/useScrollToTop";
import { useStore } from "../context/StoreContext";

const ProductDisplayPage = () => {
  useScrollToTop();
  const { _id } = useParams();
  const navigate = useNavigate();
  const reviewScrollRef = useRef(null);
  const { products, testimonials, addToCart } = useStore();

  const product = useMemo(
    () => products.find((item) => item._id === _id),
    [_id, products]
  );

  const relatedProducts = useMemo(
    () =>
      products
        .filter((item) => item.category === product?.category && item._id !== product?._id)
        .slice(0, 4),
    [product, products]
  );

  const scrollReviews = (direction) => {
    if (reviewScrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      reviewScrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center text-gray-600">
        Product not found.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 pt-28">
      <div className="grid grid-cols-1 items-start gap-12 md:grid-cols-2">
        <div className="rounded-[2rem] border bg-white p-4 ">
          <img
            src={product.image}
            alt={product.title}
            className="aspect-square w-full rounded-[1.5rem] bg-cover"
          />
        </div>

        <div className="space-y-6">
          <span className="inline-flex rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-orange-700">
            {product.badge}
          </span>
          <h1 className="text-3xl font-bold leading-tight text-gray-800 md:text-4xl">
            {product.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-yellow-500">
            {"★".repeat(Math.round(product.rating))}
            <span className="text-gray-500">
              {product.rating} rating · {product.reviews} reviews
            </span>
          </div>
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            {product.category}
          </p>
          <div className="flex items-center gap-4 text-xl font-semibold">
            <span className="text-red-500">Rs. {product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className="text-lg text-gray-400 line-through">
                Rs. {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <p className="text-sm leading-relaxed text-gray-700">{product.description}</p>

          <ul className="space-y-2 text-sm text-gray-600">
            {product.features.map((feature) => (
              <li key={feature}>• {feature}</li>
            ))}
            <li>• Free delivery within 3 to 5 business days</li>
            <li>• Seven-day hassle-free returns</li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={() => {
                addToCart(product);
                navigate("/cart");
              }}
              className="flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-orange-600"
            >
              <ShoppingCart size={20} /> Add to Cart
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-800 shadow-sm transition hover:border-black">
              <Heart size={18} /> Wishlist
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: product.title,
                    text: `Check out ${product.title} on furnivia`,
                    url: window.location.href,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.href);
                }
              }}
              className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-2 text-gray-800 shadow-sm transition hover:border-black"
            >
              <Share2 size={18} /> Share
            </button>
          </div>
        </div>
      </div>

      <div className="relative mt-16">
        <h2 className="mb-6 text-2xl font-bold text-gray-800">Customer Reviews</h2>
        <div className="absolute left-0 top-1/2 z-10 hidden -translate-y-1/2 md:flex">
          <button
            onClick={() => scrollReviews("left")}
            className="rounded-full border bg-white p-2 text-amber-600 shadow transition hover:scale-105"
          >
            <ChevronLeft size={20} />
          </button>
        </div>
        <div className="absolute right-0 top-1/2 z-10 hidden -translate-y-1/2 md:flex">
          <button
            onClick={() => scrollReviews("right")}
            className="rounded-full border bg-white p-2 text-amber-600 shadow transition hover:scale-105"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <div
          ref={reviewScrollRef}
          className="flex snap-x snap-mandatory space-x-4 overflow-x-auto scroll-smooth"
        >
          {testimonials.map((review) => (
            <div
              key={review.name}
              className="min-w-[260px] max-w-sm shrink-0 snap-center rounded-2xl border border-gray-200 bg-gray-50 p-5"
            >
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={review.image}
                  alt={review.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-700">{review.name}</p>
                  <p className="text-xs text-gray-500">{review.title}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">{review.feedback}</p>
            </div>
          ))}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-gray-800">Related Products</h2>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {relatedProducts.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="rounded-xl border bg-white shadow transition duration-300 hover:shadow-md"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-48 w-full rounded-t-xl object-cover"
                />
                <div className="p-4">
                  <h3 className="truncate text-sm font-semibold text-gray-800">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.category}</p>
                  <div className="text-sm font-bold text-red-500">
                    Rs. {item.price.toLocaleString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplayPage;
