import { NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TOKEN = process.env.LINE_TOKEN!;

export async function POST(req: Request) {
  const body = await req.json();

  for (const event of body.events ?? []) {
    if (event.type !== "message") continue;

    // テキスト
    if (event.message.type === "text") {
      await addDoc(collection(db, "items"), {
        brand: event.message.text,
        price: 0,
        place: "LINE",
        category: "その他",
        imageUrl: "",
        createdAt: new Date(),
      });
    }

    // 画像
    if (event.message.type === "image") {
      const messageId = event.message.id;

      const res = await fetch(
        `https://api-data.line.me/v2/bot/message/${messageId}/content`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      const arrayBuffer = await res.arrayBuffer();

      const imageRef = ref(storage, `line/${Date.now()}`);

      await uploadBytes(
        imageRef,
        new Uint8Array(arrayBuffer),
        {
          contentType: res.headers.get("content-type") || "image/jpeg",
        }
      );

      const imageUrl = await getDownloadURL(imageRef);

      await addDoc(collection(db, "items"), {
        brand: "LINE画像",
        price: 0,
        place: "LINE",
        category: "その他",
        imageUrl,
        createdAt: new Date(),
      });
    }
  }

  return NextResponse.json({ ok: true });
}