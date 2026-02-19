import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export async function POST(req: Request) {
  const body = await req.json();

  const events = body.events || [];

  for (const event of events) {
    if (event.type === "message" && event.message.type === "text") {
      const text = event.message.text;

      await addDoc(collection(db, "items"), {
        brand: text,
        price: 0,
        place: "LINE",
        category: "その他",
        imageUrl: "",
        createdAt: new Date(),
      });
    }
  }

  return NextResponse.json({ ok: true });
}