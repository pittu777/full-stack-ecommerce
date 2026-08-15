import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const SESSION_COOKIE_NAME = "apex_auth_session";
const JWT_SECRET = new TextEncoder().encode(
  process.env.AUTH_SECRET || "apexcommerce_super_secret_jwt_key_2026_production"
);

export interface SessionPayload {
  userId: string;
  email: string;
  role: string;
  name: string;
}

/**
 * Encrypts and creates a signed JWT session token.
 */
export async function createSessionToken(
  payload: SessionPayload,
  expiresInSeconds: number = 60 * 60 * 24 * 7 // default 7 days
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + expiresInSeconds)
    .sign(JWT_SECRET);
}

/**
 * Verifies a JWT session token and returns decoded payload.
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ["HS256"],
    });
    return payload as unknown as SessionPayload;
  } catch {
    return null;
  }
}

/**
 * Sets the signed JWT in an HTTP-only secure cookie.
 */
export async function setSessionCookie(
  payload: SessionPayload,
  rememberMe: boolean = false
): Promise<void> {
  const expiresInSeconds = rememberMe
    ? 60 * 60 * 24 * 30 // 30 days
    : 60 * 60 * 24 * 7; // 7 days

  const token = await createSessionToken(payload, expiresInSeconds);
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresInSeconds,
  });
}

/**
 * Retrieves the currently logged-in user payload from session cookie.
 */
export async function getCurrentSessionUser(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

/**
 * Clears the session cookie to log the user out.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}
