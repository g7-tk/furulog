"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function Home() {
  const [items, setItems] = useState<any[]>([]);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "items"));
    const data = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    setItems(data);
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "items", id));
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">購入一覧 (Firebase版)</h1>

      <div className="grid grid-cols-2 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-white p-4 rounded-2xl shadow">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                className="w-full h-40 object-cover rounded-xl mb-3"
              />
            )}

            <p className="font-bold">{item.brand}</p>
            <p>¥{item.price}</p>

            <button
              onClick={() => handleDelete(item.id)}
              className="mt-3 text-sm text-red-500"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}