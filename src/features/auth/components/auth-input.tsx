"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AuthInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  rightLabel?: React.ReactNode;
  startIcon?: React.ReactNode;
}

export const AuthInput = React.forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, error, rightLabel, type, id, className, startIcon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="flex flex-col gap-1.5 w-full">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-xs font-semibold tracking-wide text-zinc-700 dark:text-zinc-300 uppercase"
          >
            {label}
          </label>
          {rightLabel && <div>{rightLabel}</div>}
        </div>

        <Input
          id={id}
          ref={ref}
          type={actualType}
          startIcon={startIcon}
          endIcon={
            isPassword ? (
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((prev) => !prev)}
                className="cursor-pointer text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            ) : undefined
          }
          className={cn(
            error &&
              "border-rose-400 focus-visible:border-rose-500 focus-visible:ring-rose-500/20 dark:border-rose-500",
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-xs font-medium text-rose-500 animate-in fade-in slide-in-from-top-1 duration-150">
            {error}
          </p>
        )}
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";
