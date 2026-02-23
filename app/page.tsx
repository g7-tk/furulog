"use client";

import { useState } from "react";

export default function AddPage() {
  const [brand,setBrand]=useState("");
  const [price,setPrice]=useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4 pb-32">

      <h1 className="text-2xl font-semibold mb-4">Add Item</h1>

      <div className="space-y-3">

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-1">Brand</div>
          <input
            value={brand}
            onChange={e=>setBrand(e.target.value)}
            className="w-full outline-none text-lg"
            placeholder="ブランド"
          />
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-1">Price</div>
          <input
            value={price}
            onChange={e=>setPrice(e.target.value)}
            className="w-full outline-none text-lg"
            placeholder="価格"
          />
        </div>

      </div>

      <button className="fixed bottom-6 left-4 right-4 bg-black text-white rounded-2xl py-4 text-lg shadow active:scale-95">
        保存
      </button>

    </div>
  );
}