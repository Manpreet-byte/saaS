import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, rating, feedback } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Invalid code" }, { status: 400 });
    }

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1-5" },
        { status: 400 }
      );
    }

    console.log("Feedback received:", { code, rating });

    const { data: qr, error } = await supabase
      .from("qr_codes")
      .select("*")
      .eq("code", code)
      .single();

    if (error || !qr) {
      return NextResponse.json({ error: "Invalid QR" }, { status: 400 });
    }

  
    const { error: insertError } = await supabase
      .from("feedbacks")
      .insert([
        {
          code,
          rating,
          feedback: feedback || null,
        },
      ]);

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    if (rating >= 4) {
      return NextResponse.json({
        redirectUrl: qr.google_review_link,
      });
    }

    return NextResponse.json({
      message: "Feedback saved",
    });
  } catch (err: any) {
    console.error("Feedback API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}