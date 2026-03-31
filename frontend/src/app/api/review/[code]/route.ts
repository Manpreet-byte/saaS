import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  const body = await req.json();
  const { code, rating, feedback } = body;

  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("code", code)
    .single();

  if (error || !qr) {
    return NextResponse.json({ error: "Invalid QR" }, { status: 400 });
  }

  if (rating >= 4) {
    return NextResponse.json({
      redirectUrl: qr.google_review_link,
    });
  }

  await supabase.from("feedbacks").insert([
    {
      code,
      rating,
      feedback,
    },
  ]);

  return NextResponse.json({
    message: "Feedback saved",
  });
}