import { NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TOKEN = "84pwgSPAyhbDyxgz2cw0jOpZPU+/2UOPifEs8efclAfSDgTQ3bSYFXw+lTYOqfyG+CRqe0vl2jbvCJt44fipxSWG3764wWFojrUDonIMe9VovhyPs583O5LMwzOcFcvqYJtu5uQXS6S7t3TNe1jgdB04t89/1O/w1cDnyilFU=";

export async function POST(req: Request) {
  const body = await req.json();
  const events = body.events || [];

  for (const event of events) {
    if (event.type === "message") {
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
          {
            headers: {
              Authorization: `Bearer ${TOKEN}`,
            },
          }
        );

        const buffer = await res.arrayBuffer();

        const imageRef = ref(storage, `line/${Date.now()}.jpg`);
        await uploadBytes(imageRef, new Uint8Array(buffer));
        let imageUrl = await getDownloadURL(imageRef);
imageUrl = imageUrl.replace("firebasestorage.app", "appspot.com");

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
  }

  return NextResponse.json({ ok: true });
}