"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

export default function AddPage() {
  const [brand,setBrand]=useState("");
  const [price,setPrice]=useState("");
  const [place,setPlace]=useState("");
  const [category,setCategory]=useState("トップス");
  const [image,setImage]=useState<File|null>(null);
  const [message,setMessage]=useState("");

  const handleSubmit=async(e:any)=>{
    e.preventDefault();

    try{
      let imageUrl="";

      if(image){
        const imageRef=ref(storage,`items/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef,image);
        imageUrl=await getDownloadURL(imageRef);
      }

      await addDoc(collection(db,"items"),{
        brand,
        price,
        place,
        category,
        imageUrl,
        createdAt:new Date()
      });

      setBrand("");
      setPrice("");
      setPlace("");
      setCategory("トップス");
      setImage(null);
      setMessage("保存しました");

    }catch(err){
      console.error(err);
      setMessage("保存失敗");
    }
  };

  return(
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4 pb-32">

      <h1 className="text-2xl font-semibold mb-4">Add Item</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-1">Brand</div>
          <input value={brand} onChange={e=>setBrand(e.target.value)} className="w-full outline-none text-lg" placeholder="ブランド"/>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-1">Price</div>
          <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full outline-none text-lg" placeholder="価格"/>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-1">Place</div>
          <input value={place} onChange={e=>setPlace(e.target.value)} className="w-full outline-none text-lg" placeholder="購入場所"/>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-1">Category</div>
          <select value={category} onChange={e=>setCategory(e.target.value)} className="w-full outline-none text-lg bg-transparent">
            <option>トップス</option>
            <option>パンツ</option>
            <option>アウター</option>
            <option>シューズ</option>
            <option>小物</option>
          </select>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400 mb-2">Photo</div>
          <input type="file" accept="image/*" capture="environment" onChange={(e)=>setImage(e.target.files?.[0]||null)}/>
        </div>

        <button className="fixed bottom-6 left-4 right-4 bg-black text-white rounded-2xl py-4 text-lg shadow active:scale-95">
          保存
        </button>

      </form>

      {message && <p className="text-center mt-3 text-sm text-gray-500">{message}</p>}
    </div>
  );
}