"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snap = await getDocs(collection(db, "items"));
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data.reverse());
    };
    fetchData();
  }, []);

  const total = items.reduce((s, i) => s + (i.price || 0), 0);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-32">

      {/* Header */}
      <div className="sticky top-0 bg-zinc-950/80 backdrop-blur border-b border-zinc-800 p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Furulog</h1>
        <Link
          href="/add"
          className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium active:scale-95 transition"
        >
          Add
        </Link>
      </div>

      {/* Dashboard */}
      <div className="px-4 pt-6 space-y-3">

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-xs text-zinc-400">Items</div>
            <div className="text-xl font-semibold">{items.length}</div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
            <div className="text-xs text-zinc-400">Value</div>
            <div className="text-xl font-semibold">¥{total}</div>
          </div>
        </div>

        {/* Recent */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4">
          <div className="text-xs text-zinc-400 mb-3">Recent</div>

          <div className="flex gap-3 overflow-x-auto">
            {items.slice(0, 6).map((i:any) => (
              <div key={i.id} className="min-w-[90px]">
                {i.imageUrls?.[0] && (
                  <img
                    src={i.imageUrls[0]}
                    className="w-full h-24 object-cover rounded-xl"
                  />
                )}
                <div className="text-xs mt-1 truncate">{i.brand}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Collection grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {items.map((item:any) => (
          <div
            key={item.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden active:scale-[0.97] transition"
          >
            {item.imageUrls?.[0] && (
              <img src={item.imageUrls[0]} className="h-48 w-full object-cover" />
            )}

            <div className="p-3">
              <div className="text-sm font-medium">{item.brand}</div>
              <div className="text-xs text-zinc-400">¥{item.price}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating add */}
      <Link
        href="/add"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-white text-black flex items-center justify-center text-2xl shadow-xl active:scale-95"
      >
        +
      </Link>
    </div>
  );
}