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
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-50 pb-28">

      {/* ヘッダー */}
      <div className="sticky top-0 backdrop-blur bg-white/70 border-b p-4 flex justify-between items-center">
        <h1 className="text-2xl font-semibold tracking-tight">Furulog</h1>

        <Link
          href="/add"
          className="bg-black text-white px-4 py-2 rounded-full shadow active:scale-95 transition"
        >
          ＋
        </Link>
      </div>

      {/* ウィジェット分析 */}
      <div className="px-4 pt-4 space-y-3">

        {/* 上2つ */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow">
            <div className="text-xs text-gray-400">総アイテム</div>
            <div className="text-xl font-semibold">{items.length}</div>
          </div>

          <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow">
            <div className="text-xs text-gray-400">総金額</div>
            <div className="text-xl font-semibold">
              ¥{items.reduce((sum, i) => sum + (i.price || 0), 0)}
            </div>
          </div>
        </div>

        {/* 最近の購入 */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-2">最近の購入</div>

          {items.slice(0, 3).map((i:any) => (
            <div key={i.id} className="flex items-center gap-3 py-1">
              {i.imageUrls?.[0] && (
                <img src={i.imageUrls[0]} className="w-10 h-10 object-cover rounded-lg"/>
              )}
              <div className="text-sm flex-1">{i.brand}</div>
              <div className="text-xs text-gray-400">¥{i.price}</div>
            </div>
          ))}
        </div>

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
            className="bg-white/90 backdrop-blur rounded-3xl shadow-xl overflow-hidden transition active:scale-[0.97]"
          >
            {item.imageUrls?.[0] && (
              <img
                src={item.imageUrls[0]}
                className="h-44 w-full object-cover"
              />
            )}

            <div className="p-4 space-y-1">
              <div className="font-semibold text-[15px]">{item.brand}</div>

              <div className="text-sm text-gray-500">¥{item.price}</div>

              <div className="flex gap-2 flex-wrap pt-1">
                {item.category && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {item.category}
                  </span>
                )}
                {item.place && (
                  <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                    {item.place}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 下ナビ */}
      <div className="fixed bottom-4 left-4 right-4 bg-white/80 backdrop-blur border shadow-xl rounded-2xl flex justify-around p-3">
        <Link href="/" className="text-lg">🏠</Link>
        <Link href="/analysis" className="text-lg">📊</Link>
        <Link href="/add" className="text-lg">＋</Link>
      </div>
    </div>
  );
}