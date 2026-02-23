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

  return (
    <div className="min-h-screen bg-gray-100">

      {/* ヘッダー */}
      <div className="sticky top-0 bg-white border-b p-4 flex justify-between">
        <h1 className="text-xl font-bold">Furulog</h1>
        <Link href="/add" className="bg-black text-white px-4 py-2 rounded-xl">
          ＋登録
        </Link>
      </div>

      {/* グリッド */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {items.length === 0 && (
          <div className="col-span-2 text-center text-gray-400 py-20">
            まだ登録がありません
          </div>
        )}

        {items.map((item: any) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl shadow overflow-hidden transition transform hover:scale-[1.02]"
          >

            {item.imageUrls?.[0] && (
              <img
                src={item.imageUrls[0]}
                className="h-40 w-full object-cover"
              />
            )}

            <div className="p-3 space-y-1">
              <div className="font-semibold">{item.brand}</div>

              <div className="text-sm text-gray-500">¥{item.price}</div>

              {item.category && (
                <div className="text-xs text-gray-400">{item.category}</div>
              )}

              {item.place && (
                <div className="text-xs text-gray-400">{item.place}</div>
              )}
            </div>

          </div>
        ))}
      </div>

      {/* 下ナビ */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-3">
        <Link href="/">🏠</Link>
        <Link href="/analysis">📊</Link>
        <Link href="/add">＋</Link>
      </div>

    </div>
  );
}