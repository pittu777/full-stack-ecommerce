"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useSignUp } from "@clerk/nextjs/legacy";
import { Mail, Lock, User, Loader2, ArrowLeft } from "lucide-react";
import { GoogleIcon } from "@/components/ui/GoogleIcon";

export type AuthMode = "sign-in" | "sign-up";

interface AuthFormProps {
  mode: AuthMode;
}

/**
 * `AuthForm` — Unified, reusable Auth component for Sign In and Sign Up.
 *
 * Design Pattern: Strategy / Dynamic Component Pattern
 * Reuses identical card layout, input styles, Google OAuth handler,
 * and brand header while dynamically adapting form fields, titles,
 * Clerk authentication handlers, and navigation links.
 */
export function AuthForm({ mode }: AuthFormProps) {
  const isSignIn = mode === "sign-in";
  const router = useRouter();

  // Clerk hooks
  const { isLoaded: isSignInLoaded, signIn, setActive: setSignInActive } = useSignIn();
  const { isLoaded: isSignUpLoaded, signUp, setActive: setSignUpActive } = useSignUp();

  const isLoaded = isSignIn ? isSignInLoaded : isSignUpLoaded;

  // Form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  // Email verification step for Sign Up
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoaded) return;

    setError(null);
    setIsLoading(true);

    try {
      if (isSignIn) {
        // --- SIGN IN FLOW ---
        if (!signIn) return;
        const result = await signIn.create({
          identifier: email,
          password: password,
        });

        if (result.status === "complete" && result.createdSessionId) {
          await setSignInActive({ session: result.createdSessionId });
          router.push("/");
        } else {
          setError("Sign in incomplete. Please check your credentials.");
        }
      } else {
        // --- SIGN UP FLOW ---
        if (!signUp) return;
        await signUp.create({
          firstName,
          lastName,
          emailAddress: email,
          password,
        });

        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setPendingVerification(true);
      }
    } catch (err: unknown) {
      console.error(`[AuthForm:${mode}] Error:`, err);
      if (err && typeof err === "object" && "errors" in err) {
        const clerkErr = err as { errors: Array<{ longMessage?: string; message?: string }> };
        setError(clerkErr.errors[0]?.longMessage || clerkErr.errors[0]?.message || "Authentication failed.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Email Verification Code (Sign Up only)
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verificationCode });

      if (result.status === "complete" && result.createdSessionId) {
        await setSignUpActive({ session: result.createdSessionId });
        router.push("/");
      } else {
        setError("Verification incomplete. Please check the code.");
      }
    } catch (err: unknown) {
      console.error("[AuthForm:Verify] Error:", err);
      if (err && typeof err === "object" && "errors" in err) {
        const clerkErr = err as { errors: Array<{ longMessage?: string; message?: string }> };
        setError(clerkErr.errors[0]?.longMessage || clerkErr.errors[0]?.message || "Invalid verification code.");
      } else {
        setError("Verification failed. Please check the code and try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google OAuth Sign In / Sign Up
  const handleGoogleAuth = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      if (isSignIn && signIn) {
        await signIn.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        });
      } else if (!isSignIn && signUp) {
        await signUp.authenticateWithRedirect({
          strategy: "oauth_google",
          redirectUrl: "/sso-callback",
          redirectUrlComplete: "/",
        });
      }
    } catch (err) {
      console.error(`[AuthForm:Google] Error:`, err);
      setError("Failed to initiate Google authentication.");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Brand Title */}
      <h1 className="text-4xl font-black tracking-tight text-[#3b38d6] dark:text-indigo-400 mb-8 select-none">
        ShopNow
      </h1>

      {/* Card Container */}
      <div className="w-full max-w-[440px] bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-8 sm:p-10 shadow-sm">
        {/* Verification Screen (Sign Up only) */}
        {!isSignIn && pendingVerification ? (
          <div>
            <button
              type="button"
              onClick={() => setPendingVerification(false)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white mb-4 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Verify your email
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                We sent a 6-digit code to{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  {email}
                </span>
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Verification Code
                </label>
                <input
                  type="text"
                  required
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="w-full text-center tracking-widest text-lg py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#3b38d6]/20 focus:border-[#3b38d6] transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-[#3b38d6] hover:bg-[#312cc4] active:bg-[#2823a9] text-white font-medium text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Complete Sign Up"
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Standard Auth Form */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {isSignIn ? "Welcome back" : "Create an account"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {isSignIn
                  ? "Please enter your details to sign in."
                  : "Please enter your details to sign up."}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* First Name & Last Name (Sign Up only) */}
              {!isSignIn && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      First Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b38d6]/20 focus:border-[#3b38d6] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Last Name
                    </label>
                    <div className="relative flex items-center">
                      <User className="absolute left-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b38d6]/20 focus:border-[#3b38d6] transition"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b38d6]/20 focus:border-[#3b38d6] transition"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3b38d6]/20 focus:border-[#3b38d6] transition"
                  />
                </div>
              </div>

              {/* Remember me & Forgot Password (Sign In only) */}
              {isSignIn && (
                <div className="flex items-center justify-between pt-1 pb-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-[#3b38d6] focus:ring-[#3b38d6]/30 cursor-pointer"
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      Remember me
                    </span>
                  </label>

                  <span
                    onClick={() => alert("Password reset link will be sent to your email.")}
                    className="text-xs font-semibold text-[#3b38d6] dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !isLoaded}
                className="w-full py-2.5 bg-[#3b38d6] hover:bg-[#312cc4] active:bg-[#2823a9] text-white font-medium text-sm rounded-xl transition shadow-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isSignIn ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  isSignIn ? "Sign in" : "Create account"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200 dark:border-slate-800" />
              </div>
              <span className="relative px-3 bg-white dark:bg-slate-900 text-[11px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Or continue with
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isLoading || !isLoaded}
              className="w-full py-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium text-slate-700 dark:text-slate-200 transition shadow-xs flex items-center justify-center gap-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <GoogleIcon />
              <span>Google</span>
            </button>

            {/* Footer Link */}
            <p className="text-xs text-slate-600 dark:text-slate-400 text-center mt-6">
              {isSignIn ? (
                <>
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/sign-up"
                    className="font-semibold text-[#3b38d6] dark:text-indigo-400 hover:underline"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <Link
                    href="/sign-in"
                    className="font-semibold text-[#3b38d6] dark:text-indigo-400 hover:underline"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>
        )}

        {/* Clerk Smart CAPTCHA container for custom auth flows */}
        <div id="clerk-captcha" />
      </div>
    </div>
  );
}
