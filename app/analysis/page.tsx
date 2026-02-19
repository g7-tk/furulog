"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const COLORS = ["#111", "#555", "#888", "#bbb", "#ddd"];

export default function AnalysisPage() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const snapshot = await getDocs(collection(db, "items"));
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 総額
    const totalPrice = data.reduce(
      (sum, item: any) => sum + Number(item.price || 0),
      0
    );
    setTotal(totalPrice);

    // カテゴリー集計
    const stats: any = {};

    data.forEach((item: any) => {
      if (!stats[item.category]) {
        stats[item.category] = 0;
      }
      stats[item.category] += Number(item.price || 0);
    });

    const formatted = Object.keys(stats).map(key => ({
      name: key,
      value: stats[key],
    }));

    setChartData(formatted);
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">分析</h1>

      <p className="mb-4 font-semibold">
        総購入金額：¥{total}
      </p>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
            >
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}