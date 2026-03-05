"use client";

import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
ç

export default function ItemDetail() {
  const Ω√√√√√z= useParams<{ id: string }>();
  const id = params?.id;

  const [item, setItem] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchItem = async () => {
      const snap = await getDoc(doc(db, "items", id));
      if (snap.exists()) {
        setItem({ id: snap.id, ...snap.data() });
      }
    };

    fetchItem();
  }, [id]);

  if (!id || !item) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 pb-32">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          className="w-full h-80 object-cover"
        />
      )}

      <div className="p-5 space-y-3">
        <div className="text-2xl font-semibold">{item.brand}</div>

        <div className="text-gray-500">¥{item.price}</div>

        {item.place && (
          <div className="bg-white rounded-xl p-4 shadow">
            購入場所：{item.place}
          </div>
        )}

        {item.category && (
          <div className="bg-white rounded-xl p-4 shadow">
            カテゴリ：{item.category}
          </div>
        )}
      </div>
    </div>
  );
}