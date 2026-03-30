import { handleGoogleLogin } from "@/lib/auth/handlers";

export async function GET() {
  return handleGoogleLogin();
}
