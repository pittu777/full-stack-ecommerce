import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your ShopNow account.",
};

export default function SignInPage() {
  return <AuthForm mode="sign-in" />;
}
