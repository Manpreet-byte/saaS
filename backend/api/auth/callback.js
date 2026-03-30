import { handleGoogleCallback } from "../../services/googleService.js";

export async function GET(request) {
  return handleGoogleCallback(request);
}
