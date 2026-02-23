"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AnalysisPage() {
  const [items,setItems]=useState<any[]>([]);

  useEffect(()=>{
    const fetchData=async()=>{
      const snap=await getDocs(collection(db,"items"));
      const data=snap.docs.map(d=>({id:d.id,...d.data()}));
      setItems(data);
    };
    fetchData();
  },[]);

  const total=items.reduce((s,i)=>s+(Number(i.price)||0),0);

  const categoryMap:any={};
  items.forEach(i=>{
    if(!i.category)return;
    categoryMap[i.category]=(categoryMap[i.category]||0)+1;
  });

  const topCategories=Object.entries(categoryMap).sort((a:any,b:any)=>b[1]-a[1]);

  return(
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4 pb-32">

      <h1 className="text-2xl font-semibold mb-4">Analysis</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400">Total Items</div>
          <div className="text-xl font-semibold">{items.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400">Total Spend</div>
          <div className="text-xl font-semibold">¥{total}</div>
        </div>
      </div>

      {/* Category ranking */}
      <div className="bg-white rounded-2xl p-4 shadow mb-3">
        <div className="text-xs text-gray-400 mb-2">Category Ranking</div>

        <div className="space-y-2">
          {topCategories.map((c:any)=>(
            <div key={c[0]} className="flex justify-between text-sm">
              <span>{c[0]}</span>
              <span className="text-gray-400">{c[1]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent purchases */}
      <div className="bg-white rounded-2xl p-4 shadow">
        <div className="text-xs text-gray-400 mb-2">Recent Purchases</div>

        <div className="space-y-2">
          {items.slice(0,5).map(i=>(
            <div key={i.id} className="flex items-center gap-3">
              {i.imageUrl && (
                <img src={i.imageUrl} className="w-10 h-10 object-cover rounded-lg"/>
              )}
              <div className="flex-1 text-sm">{i.brand}</div>
              <div className="text-xs text-gray-400">¥{i.price}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}