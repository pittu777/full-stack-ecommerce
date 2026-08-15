"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import { AuthCard } from "./auth-card";
import { AuthInput } from "./auth-input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  loginSchema,
  signupSchema,
  LoginSchemaType,
  SignupSchemaType,
} from "../schemas/auth.schema";
import { AuthFormProps } from "../types/auth.types";
import { loginAction, registerAction } from "../actions/auth.actions";

interface FormValues {
  fullName?: string;
  email: string;
  password: string;
  confirmPassword?: string;
  rememberMe?: boolean;
  agreeToTerms?: boolean;
}

export function AuthForm({ mode, onSuccess, redirectTo = "/" }: AuthFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();

  const isLogin = mode === "login";

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(isLogin ? loginSchema : signupSchema) as unknown as Resolver<FormValues>,
    defaultValues: isLogin
      ? { email: "", password: "", rememberMe: false }
      : { fullName: "", email: "", password: "", confirmPassword: "", agreeToTerms: false },
  });

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      if (isLogin) {
        const result = await loginAction(data as LoginSchemaType);
        if (!result.success) {
          setServerError(result.error || "Failed to log in.");
          return;
        }
      } else {
        const result = await registerAction(data as SignupSchemaType);
        if (!result.success) {
          setServerError(result.error || "Failed to create account.");
          return;
        }
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard mode={mode}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {serverError && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs font-medium text-rose-600 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-400 animate-in fade-in duration-150">
            {serverError}
          </div>
        )}

        {/* Full Name field (Signup Only) */}
        {!isLogin && (
          <AuthInput
            id="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            startIcon={<User className="size-4" />}
            error={errors.fullName?.message}
            {...register("fullName")}
          />
        )}

        {/* Email field */}
        <AuthInput
          id="email"
          label="Email"
          type="email"
          placeholder="Enter your email"
          startIcon={<Mail className="size-4" />}
          error={errors.email?.message}
          {...register("email")}
        />

        {/* Password field */}
        <AuthInput
          id="password"
          label="Password"
          type="password"
          placeholder={isLogin ? "••••••••" : "Create a password (min. 8 chars)"}
          startIcon={<Lock className="size-4" />}
          error={errors.password?.message}
          {...register("password")}
        />

        {/* Confirm Password field (Signup Only) */}
        {!isLogin && (
          <AuthInput
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Re-enter your password"
            startIcon={<Lock className="size-4" />}
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
        )}

        {/* Options Row */}
        {isLogin ? (
          <div className="flex items-center justify-between pt-0.5">
            <div className="flex items-center gap-2">
              <Controller
                name="rememberMe"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="rememberMe"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <label
                htmlFor="rememberMe"
                className="cursor-pointer text-xs font-medium text-zinc-600 dark:text-zinc-400 select-none"
              >
                Remember me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-1 pt-0.5">
            <div className="flex items-start gap-2">
              <Controller
                name="agreeToTerms"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="agreeToTerms"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5"
                  />
                )}
              />
              <label
                htmlFor="agreeToTerms"
                className="cursor-pointer text-xs text-zinc-600 dark:text-zinc-400 select-none leading-normal"
              >
                I agree to the{" "}
                <Link href="/terms" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.agreeToTerms?.message && (
              <p className="text-xs font-medium text-rose-500">
                {errors.agreeToTerms.message}
              </p>
            )}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600/40 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70 dark:bg-indigo-600 dark:hover:bg-indigo-500 cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              <span>{isLogin ? "Signing in..." : "Creating account..."}</span>
            </>
          ) : (
            <span>{isLogin ? "Sign in" : "Create account"}</span>
          )}
        </button>
      </form>
    </AuthCard>
  );
}
