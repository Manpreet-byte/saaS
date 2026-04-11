import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { nanoid } from "nanoid";

type QRRequest = {
  business_id: string;
  google_review_link: string;
};

export async function POST(req: Request) {
  try {
    const body: QRRequest = await req.json();
    const { business_id, google_review_link } = body;

    if (!business_id || typeof business_id !== "string") {
      return NextResponse.json({ error: "Invalid business_id" }, { status: 400 });
    }

    if (!google_review_link || !google_review_link.startsWith("http")) {
      return NextResponse.json({ error: "Invalid Google review link" }, { status: 400 });
    }

    const code = nanoid(8);

    const { data, error } = await supabase
      .from("qr_codes")
      .insert([
        {
          code,
          business_id,
          google_review_link,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
    const qrUrl = `${baseUrl}/r/${code}`;

    return NextResponse.json({
      success: true,
      qrUrl,
      code,
    });
  } catch (err: any) {
    console.error("QR API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}