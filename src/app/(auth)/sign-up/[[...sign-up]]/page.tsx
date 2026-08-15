import type { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create your ShopNow account.",
};

export default function SignUpPage() {
  return <AuthForm mode="sign-up" />;
}
