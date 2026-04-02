import { authEnv } from "@/lib/auth/env";
import { SessionPayload } from "@/lib/auth/types";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

const bytesToBinary = (bytes: Uint8Array) =>
  Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");

const binaryToBytes = (value: string) =>
  Uint8Array.from(value, (char) => char.charCodeAt(0));

const toBase64 = (value: Uint8Array) => {
  if (typeof btoa === "function") {
    return btoa(bytesToBinary(value));
  }

  return Buffer.from(value).toString("base64");
};

const fromBase64 = (value: string) => {
  if (typeof atob === "function") {
    return binaryToBytes(atob(value));
  }

  return Uint8Array.from(Buffer.from(value, "base64"));
};

const base64UrlEncode = (input: string | Uint8Array) => {
  const bytes = typeof input === "string" ? encoder.encode(input) : input;

  return toBase64(bytes)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
};

const base64UrlDecodeToBytes = (input: string) => {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");

  return fromBase64(padded);
};

const base64UrlDecodeToString = (input: string) =>
  decoder.decode(base64UrlDecodeToBytes(input));

const getJwtKey = () =>
  crypto.subtle.importKey(
    "raw",
    encoder.encode(authEnv.jwtSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

export const signJwt = async (
  payload: Omit<SessionPayload, "iat" | "exp">,
  expiresInSeconds = authEnv.jwtExpiresInSeconds,
) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const body: SessionPayload = {
    ...payload,
    iat: issuedAt,
    exp: issuedAt + expiresInSeconds,
  };

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(body));
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const key = await getJwtKey();
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    encoder.encode(unsignedToken),
  );

  return `${unsignedToken}.${base64UrlEncode(new Uint8Array(signature))}`;
};

export const verifyJwt = async (token: string) => {
  const [encodedHeader, encodedPayload, encodedSignature] = token.split(".");

  if (!encodedHeader || !encodedPayload || !encodedSignature) {
    return null;
  }

  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const key = await getJwtKey();
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlDecodeToBytes(encodedSignature),
    encoder.encode(unsignedToken),
  );

  if (!isValid) {
    return null;
  }

  const payload = JSON.parse(
    base64UrlDecodeToString(encodedPayload),
  ) as SessionPayload;

  if (payload.exp <= Math.floor(Date.now() / 1000)) {
    return null;
  }

  return payload;
};
