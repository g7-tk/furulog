"use client";
import { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from "firebase/storage";

import { db, storage } from "@/lib/firebase";

export default function AddPage() {
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [place, setPlace] = useState("");
  const [category, setCategory] = useState("トップス");
  const [image, setImage] = useState<File | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const snapshot = await getDocs(collection(db, "items"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setItems(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = "";

      if (image) {
        const imageRef = ref(storage, `items/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      await addDoc(collection(db, "items"), {
        brand,
        price,
        place,
        category,
        imageUrl,
        createdAt: new Date(),
      });

      setMessage("保存しました！");
      fetchItems();

      setBrand("");
      setPrice("");
      setPlace("");
      setCategory("トップス");
      setImage(null);
    } catch (err) {
      console.error(err);
      setMessage("保存失敗");
    }
  };

  const handleDelete = async (item: any) => {
    try {
      await deleteDoc(doc(db, "items", item.id));

      if (item.imageUrl) {
        const imageRef = ref(storage, item.imageUrl);
        await deleteObject(imageRef).catch(() => {});
      }

      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4">
      <h1 className="text-xl font-bold">登録</h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          placeholder="ブランド"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full p-3 rounded-xl border"
        />

        <input
          type="number"
          placeholder="価格"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-3 rounded-xl border"
        />

        <input
          type="text"
          placeholder="購入場所"
          value={place}
          onChange={(e) => setPlace(e.target.value)}
          className="w-full p-3 rounded-xl border"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-3 rounded-xl border"
        >
          <option>トップス</option>
          <option>パンツ</option>
          <option>アウター</option>
          <option>シューズ</option>
          <option>小物</option>
        </select>

        {/* 📱 カメラ対応 */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          className="w-full p-3 rounded-xl border bg-white"
        />

        <button className="w-full bg-black text-white p-3 rounded-xl">
          保存
        </button>
      </form>

      {message && <p>{message}</p>}

      {/* 一覧 */}
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-2xl shadow">
            {item.imageUrl && (
              <img
                src={item.imageUrl}
                className="w-full h-52 object-cover rounded-xl mb-2"
              />
            )}

            <p className="font-semibold">{item.brand}</p>
            <p className="text-sm text-gray-500">
              ¥{item.price} ・ {item.category}
            </p>

            <button
              onClick={() => handleDelete(item)}
              className="text-red-500 text-sm mt-1"
            >
              削除
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}