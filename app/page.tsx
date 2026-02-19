import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold mb-8">FURULOG</h1>

      <Link
        href="/items"
        className="bg-white px-8 py-4 rounded-xl shadow hover:shadow-lg transition"
      >
        🛍 購入一覧
      </Link>

      <Link
        href="/add"
        className="bg-white px-8 py-4 rounded-xl shadow hover:shadow-lg transition"
      >
        ➕ 購入登録
      </Link>

      <Link
        href="/analytics"
        className="bg-white px-8 py-4 rounded-xl shadow hover:shadow-lg transition"
      >
        📊 分析
      </Link>
    </div>
  );
}
