import { NextResponse } from "next/server";
import { db, storage } from "@/lib/firebase";
import {
  collection,
  addDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const TOKEN = process.env.LINE_TOKEN!;

async function reply(replyToken: string, text: string) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [{ type: "text", text }],
    }),
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  for (const event of body.events ?? []) {

   

    if (event.type !== "message") continue;

    const userId = event.source?.userId;
    if (!userId) continue;

    const draftRef = doc(db, "drafts", userId);

    // ===== 登録開始 =====
    if (event.message.type === "text" && event.message.text === "登録") {
      await setDoc(draftRef, {
        brand: "",
        price: 0,
        place: "",
        category: "",
        imageUrls: [],
      });

      await reply(event.replyToken, "登録を開始しました。入力してください。");
      continue;
    }

    const draftSnap = await getDoc(draftRef);
    if (!draftSnap.exists()) continue;

    const draft = draftSnap.data();

    // ===== テキスト =====
    if (event.message.type === "text") {
      const text = event.message.text;

      if (text === "完了") {
        const finalSnap = await getDoc(draftRef);

        await addDoc(collection(db, "items"), {
          ...finalSnap.data(),
          createdAt: new Date(),
        });

        await deleteDoc(draftRef);
        await reply(event.replyToken, "保存しました！");
        continue;
      }

      if (/^\d+$/.test(text)) {
        await updateDoc(draftRef, { price: Number(text) });
      } else {
        await updateDoc(draftRef, { brand: text });
      }

      await reply(event.replyToken, "保存しました。続けて入力してください。");
    }

    // ===== 画像 =====
    if (event.message.type === "image") {
      const res = await fetch(
        `https://api-data.line.me/v2/bot/message/${event.message.id}/content`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      const arrayBuffer = await res.arrayBuffer();

      const imageRef = ref(storage, `line/${Date.now()}.jpg`);

      await uploadBytes(
        imageRef,
        new Uint8Array(arrayBuffer),
        {
          contentType: res.headers.get("content-type") || "image/jpeg",
        }
      );

      const imageUrl = await getDownloadURL(imageRef);

      const latestSnap = await getDoc(draftRef);
      const latest = latestSnap.data();

      await updateDoc(draftRef, {
        imageUrls: [...(latest?.imageUrls || []), imageUrl],
      });

      await reply(event.replyToken, "写真を追加しました。");
    }
  }

  return NextResponse.json({ ok: true });
}