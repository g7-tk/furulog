"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";

interface Item {
  id: string;
  brand: string;
  price: number;
  image: string;
  createdAt: any;
}

export default function ItemsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, "items"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const list: Item[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Item));
        setItems(list);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8">購入一覧 (Firebase版)</h1>

      {loading ? (
        <p>読み込み中...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-600">まだ購入したアイテムはありません。</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {item.image && (
                <img
                  src={item.image}
                  alt={item.brand}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold">{item.brand}</h2>
                <p className="text-gray-600 mt-2">
                  ¥{item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
