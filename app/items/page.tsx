"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function ItemsPage() {
  const [items, setItems] = useState<any[]>([]);

  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, "items"));
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setItems(data);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "items", id));
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">
        購入一覧（Firebase版）
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-2xl shadow"
          >
            {/* 画像 */}
            {item.imageUrls?.length > 0 && (
              <img
                src={item.imageUrls[0]}
                alt="item"
                className="w-full h-48 object-cover rounded-xl mb-3"
              />
            )}

            {/* ブランド */}
            <div className="font-bold text-lg">
              {item.brand}
            </div>

            {/* 価格 */}
            <div className="text-gray-600">
              ¥{item.price}
            </div>

            {/* 場所 */}
            {item.place && (
              <div className="text-sm text-gray-500">
                {item.place}
              </div>
            )}

            <button
              onClick={() => handleDelete(item.id)}
              className="text-red-500 text-sm mt-2"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}