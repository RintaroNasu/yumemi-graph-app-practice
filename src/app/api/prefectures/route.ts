import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch("https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": process.env.RESAS_API_KEY || "",
      },
    });

    if (!response.ok) {
      console.error(`Failed to fetch data from external API: ${response.status} ${response.statusText}`);
      return NextResponse.json({ error: "外部APIからのデータ取得に失敗しました" }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("サーバーエラー:", error);
    return NextResponse.json({ error: "データの取得に失敗しました" }, { status: 500 });
  }
}
