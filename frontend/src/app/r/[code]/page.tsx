import { supabase } from "../../../lib/supabaseClient";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    code: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { code } = await params;


  const { data: qr, error } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("code", code)
    .single();


  if (error || !qr) {
    return <h1>Invalid QR</h1>;
  }

  redirect(`/review/${code}`);
}