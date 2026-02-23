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

  let cumulative=0;
  const palette=["#111827","#6366f1","#ec4899","#10b981","#f59e0b"];

  const slices=categories.map((c:any,index:number)=>{
    const value=c[1];
    const start=cumulative/sum*100;
    cumulative+=value;
    const end=cumulative/sum*100;
    return {label:c[0],start,end,color:palette[index%palette.length],value};
  });

  return(
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100 p-4 pb-32 text-gray-900">

      {/* Header */}
      <div className="sticky top-0 backdrop-blur bg-white/70 border-b p-4 mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">Analysis</h1>
        <p className="text-sm text-gray-400">あなたの購入傾向</p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-400 mb-1">Items</div>
          <div className="text-2xl font-semibold">{items.length}</div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="text-xs text-gray-400 mb-1">Spend</div>
          <div className="text-2xl font-semibold">¥{total}</div>
        </div>
      </div>

      {/* Chart card */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
        <div className="flex justify-between items-center mb-4">
          <div className="text-sm font-medium">Category Balance</div>
          <div className="text-xs text-gray-400">{sum} items</div>
        </div>

        {/* donut */}
        <div className="flex justify-center mb-5">
          <div className="relative w-44 h-44">
            {slices.map((s:any,i:number)=>(
              <div
                key={i}
                className="absolute inset-0 rounded-full transition"
                style={{
                  background:`conic-gradient(${s.color} ${s.start}% ${s.end}%, transparent ${s.end}% 100%)`,
                  mask:"radial-gradient(circle 64px at center, transparent 99%, black 100%)",
                  WebkitMask:"radial-gradient(circle 64px at center, transparent 99%, black 100%)"
                }}
              />
            ))}
          </div>
        </div>

        {/* legend with bars */}
        <div className="space-y-3">
          {slices.map((s:any,i:number)=>(
            <div key={i}>
              <div className="flex justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{background:s.color}}/>
                  <span>{s.label}</span>
                </div>
                <span className="text-gray-400">{s.value}</span>
              </div>

              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width:`${(s.value/sum)*100}%`,
                    background:s.color
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
        <div className="text-sm font-medium mb-3">Recent Purchases</div>

        <div className="space-y-2">
          {items.slice(0,5).map(i=>(
            <div key={i.id} className="flex items-center gap-3">
              {i.imageUrl && (
                <img src={i.imageUrl} className="w-11 h-11 object-cover rounded-xl"/>
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