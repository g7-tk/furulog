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

async function reply(replyToken: string, message: any) {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
    body: JSON.stringify({
      replyToken,
      messages: [message],
    }),
  });
}

export async function POST(req: Request) {
  const body = await req.json();

  for (const event of body.events ?? []) {
    if (event.type !== "message") continue;

    const userId = event.source.userId;
    const draftRef = doc(db, "drafts", userId);
    const draftSnap = await getDoc(draftRef);

    // 登録開始
    if (event.message.type === "text" && event.message.text === "登録") {
      await setDoc(draftRef, {
        brand: "",
        price: 0,
        place: "",
        category: "",
        imageUrls: [],
      });

      await reply(event.replyToken, {
        type: "text",
        text: "登録を開始しました。ブランド・価格・場所・写真を送ってください。",
      });

      continue;
    }

    if (!draftSnap.exists()) continue;

    const draft = draftSnap.data();

    // テキスト処理
    if (event.message.type === "text") {
      const text = event.message.text;

      if (/^\d+$/.test(text)) {
        await updateDoc(draftRef, { price: Number(text) });
      } else {
        await updateDoc(draftRef, { brand: text });
      }

      await reply(event.replyToken, {
        type: "text",
        text: "保存しました。続けて入力してください。完了と送ると保存します。",
      });
    }

    // 画像処理
    if (event.message.type === "image") {
      const res = await fetch(
        `https://api-data.line.me/v2/bot/message/${event.message.id}/content`,
        { headers: { Authorization: `Bearer ${TOKEN}` } }
      );

      const arrayBuffer = await res.arrayBuffer();
      const imageRef = ref(storage, `line/${Date.now()}`);

      await uploadBytes(imageRef, new Uint8Array(arrayBuffer), {
        contentType: res.headers.get("content-type") || "image/jpeg",
      });

      const imageUrl = await getDownloadURL(imageRef);

      await updateDoc(draftRef, {
        imageUrls: [...(draft.imageUrls || []), imageUrl],
      });

      await reply(event.replyToken, {
        type: "text",
        text: "写真を追加しました。",
      });
    }

    // 完了
    if (event.message.type === "text" && event.message.text === "完了") {
      const final = (await getDoc(draftRef)).data();

      await addDoc(collection(db, "items"), {
        ...final,
        createdAt: new Date(),
      });

      await deleteDoc(draftRef);

      await reply(event.replyToken, {
        type: "text",
        text: "保存しました！",
      });
    }
  }

  return NextResponse.json({ ok: true });
}