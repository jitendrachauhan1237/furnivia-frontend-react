import React, { useState } from "react";
import { db, doc, setDoc } from "../Firebase/firebase.config";
import { mockProducts } from "../data/mockStore";

const SeedData = () => {
  const [status, setStatus] = useState("Idle");

  const handleSeed = async () => {
    setStatus("Seeding in progress...");
    try {
      for (const product of mockProducts) {
        await setDoc(doc(db, "products", product._id), product);
      }
      setStatus("Successfully seeded all products!");
    } catch (error) {
      console.error(error);
      setStatus("Error during seeding. Check console.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 pt-20">
      <div className="rounded-2xl bg-white p-10 shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Database Seeder</h2>
        <p className="text-gray-600 mb-6">
          This will upload all mock products from <code>mockStore.js</code> into the Firestore <code>products</code> collection.
        </p>
        <button
          onClick={handleSeed}
          className="w-full rounded-xl bg-amber-600 px-4 py-3 font-semibold text-white transition hover:bg-amber-700 disabled:opacity-50"
          disabled={status.includes("progress")}
        >
          Seed Products
        </button>
        <p className="mt-4 font-medium text-gray-800">{status}</p>
      </div>
    </div>
  );
};

export default SeedData;
