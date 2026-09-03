import { NextRequest, NextResponse } from "next/server";

// In-memory translation cache (survives across requests in the server instance)
const SERVER_CACHE = new Map<string, string>();

async function translateSingle(text: string, targetLang: string): Promise<string> {
  const trimmed = text.trim();
  if (!trimmed || targetLang === "en") return text;

  // Check in-memory cache
  const cacheKey = `${targetLang}:${trimmed}`;
  if (SERVER_CACHE.has(cacheKey)) {
    return SERVER_CACHE.get(cacheKey)!;
  }

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(targetLang)}&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) MineGuard-AI/2.0",
        "Accept": "*/*"
      }
    });

    if (!res.ok) {
      throw new Error(`Translation API HTTP ${res.status}`);
    }

    const data = await res.json();
    if (Array.isArray(data) && Array.isArray(data[0])) {
      const translated = data[0].map((chunk: any) => chunk[0]).filter(Boolean).join("");
      if (translated) {
        SERVER_CACHE.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    // Fallback: try MyMemory API
    try {
      const myMemUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(trimmed)}&langpair=en|${targetLang}`;
      const myMemRes = await fetch(myMemUrl);
      if (myMemRes.ok) {
        const myMemData = await myMemRes.json();
        if (myMemData?.responseData?.translatedText) {
          const resText = myMemData.responseData.translatedText;
          SERVER_CACHE.set(cacheKey, resText);
          return resText;
        }
      }
    } catch {
      // Return original text on network failure
    }
  }

  return text;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { texts, targetLang } = body;

    if (!Array.isArray(texts) || !targetLang) {
      return NextResponse.json({ error: "Invalid payload. Expected { texts: string[], targetLang: string }" }, { status: 400 });
    }

    if (targetLang === "en") {
      return NextResponse.json({ translated: texts, source: "bypass" });
    }

    // Process in parallel batches of 8
    const results: string[] = [];
    const BATCH_SIZE = 8;
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
      const batch = texts.slice(i, i + BATCH_SIZE);
      const batchResults = await Promise.all(batch.map(t => translateSingle(t, targetLang)));
      results.push(...batchResults);
    }

    return NextResponse.json({
      translated: results,
      targetLang,
      count: results.length,
      cachedCount: SERVER_CACHE.size
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Translation error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const text = searchParams.get("text");
  const targetLang = searchParams.get("targetLang") || "mr";

  if (!text) {
    return NextResponse.json({ error: "Missing text parameter" }, { status: 400 });
  }

  const translated = await translateSingle(text, targetLang);
  return NextResponse.json({ original: text, translated, targetLang });
}
