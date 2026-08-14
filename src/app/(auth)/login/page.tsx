import { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Sign In | ApexCommerce",
  description: "Sign in to your ApexCommerce account",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
