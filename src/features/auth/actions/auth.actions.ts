"use server";

import prisma from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  setSessionCookie,
  clearSessionCookie,
  getCurrentSessionUser,
  SessionPayload,
} from "@/lib/auth/session";
import {
  loginSchema,
  signupSchema,
  LoginSchemaType,
  SignupSchemaType,
} from "../schemas/auth.schema";

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Server Action to register a new user.
 */
export async function registerAction(
  rawData: SignupSchemaType
): Promise<ActionResult<{ user: SessionPayload }>> {
  try {
    const validated = signupSchema.safeParse(rawData);

    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Invalid input data";
      return { success: false, error: firstError };
    }

    const { fullName, email, password } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingUser) {
      return {
        success: false,
        error: "An account with this email already exists. Please sign in instead.",
      };
    }

    // Hash password securely
    const hashedPassword = await hashPassword(password);

    // Create user in PostgreSQL database
    const newUser = await prisma.user.create({
      data: {
        name: fullName.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    const sessionPayload: SessionPayload = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };

    // Create and attach signed session cookie
    await setSessionCookie(sessionPayload, false);

    return {
      success: true,
      data: { user: sessionPayload },
    };
  } catch (error) {
    console.error("Error during registration:", error);
    return {
      success: false,
      error: "An unexpected server error occurred during registration. Please try again.",
    };
  }
}

/**
 * Server Action to log in an existing user.
 */
export async function loginAction(
  rawData: LoginSchemaType
): Promise<ActionResult<{ user: SessionPayload }>> {
  try {
    const validated = loginSchema.safeParse(rawData);

    if (!validated.success) {
      const firstError = validated.error.issues[0]?.message || "Invalid credentials format";
      return { success: false, error: firstError };
    }

    const { email, password, rememberMe } = validated.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Look up user by unique email
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return {
        success: false,
        error: "Invalid email or password. Please try again.",
      };
    }

    // Verify hashed password
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        error: "Invalid email or password. Please try again.",
      };
    }

    const sessionPayload: SessionPayload = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    // Create and attach signed session cookie
    await setSessionCookie(sessionPayload, Boolean(rememberMe));

    return {
      success: true,
      data: { user: sessionPayload },
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      success: false,
      error: "An unexpected server error occurred during login. Please try again.",
    };
  }
}

/**
 * Server Action to log out the currently authenticated user.
 */
export async function logoutAction(): Promise<ActionResult> {
  try {
    await clearSessionCookie();
    return { success: true };
  } catch (error) {
    console.error("Error during logout:", error);
    return { success: false, error: "Failed to log out cleanly." };
  }
}

/**
 * Server Action to get the currently authenticated user.
 */
export async function getCurrentUserAction(): Promise<SessionPayload | null> {
  try {
    return await getCurrentSessionUser();
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
