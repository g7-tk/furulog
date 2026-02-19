import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Furulog",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="bg-gray-100">
        <main className="pb-20">{children}</main>

        {/* 🔥 下固定ナビ */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around py-3">
          <Link href="/" className="font-semibold">
            ホーム
          </Link>

          <Link href="/add" className="font-semibold">
            登録
          </Link>

          <Link href="/analysis" className="font-semibold">
            分析
          </Link>
        </nav>
      </body>
    </html>
  );
}