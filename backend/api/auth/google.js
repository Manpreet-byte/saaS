import { handleGoogleLogin } from "../../services/googleService.js";

export async function GET() {
  return handleGoogleLogin();
}
