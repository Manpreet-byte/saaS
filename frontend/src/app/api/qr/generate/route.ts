import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { business_id, google_review_link } = body;

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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const qrUrl = `http://localhost:3001/r/${code}`;

    return NextResponse.json({
      success: true,
      qrUrl,
      code,
    });
  } catch (err) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}