import { supabase } from "../../../lib/supabaseClient";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    code: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { code } = await params;

  // 🔥 Supabase se data fetch
  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("code", code)
    .single();

  // ❌ Agar QR nahi mila
  if (error || !qr) {
    return <h1>Invalid QR</h1>;
  }

  // ✅ Agar QR mil gaya → review page
  redirect(`/review/${code}`);
}