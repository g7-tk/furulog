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

  const categories=Object.entries(categoryMap);

  const sum=categories.reduce((s:any,c:any)=>s+c[1],0);

  // simple pie calc
  let cumulative=0;
  const colors=["#111","#666","#999","#ccc","#ddd"];

  const slices=categories.map((c:any,index:number)=>{
    const value=c[1];
    const start=cumulative/sum*100;
    cumulative+=value;
    const end=cumulative/sum*100;
    return {label:c[0],start,end,color:colors[index%colors.length],value};
  });

  return(
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4 pb-32">

      <h1 className="text-2xl font-semibold mb-4">Analysis</h1>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400">Total Items</div>
          <div className="text-xl font-semibold">{items.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="text-xs text-gray-400">Total Spend</div>
          <div className="text-xl font-semibold">¥{total}</div>
        </div>
      </div>

      {/* Pie chart */}
      <div className="bg-white rounded-2xl p-6 shadow mb-4">
        <div className="text-xs text-gray-400 mb-3">Category Pie</div>

        <div className="flex justify-center">
          <div className="relative w-40 h-40">
            {slices.map((s:any,i:number)=>(
              <div
                key={i}
                className="absolute inset-0 rounded-full"
                style={{
                  background:`conic-gradient(${s.color} ${s.start}% ${s.end}%, transparent ${s.end}% 100%)`,
                  mask:"radial-gradient(circle 55px at center, transparent 98%, black 100%)",
                  WebkitMask:"radial-gradient(circle 55px at center, transparent 98%, black 100%)"
                }}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {slices.map((s:any,i:number)=>(
            <div key={i} className="flex justify-between text-sm">
              <span>{s.label}</span>
              <span className="text-gray-400">{s.value}</span>
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