import { Metadata } from "next";
import { AuthForm } from "@/features/auth/components/auth-form";

export const metadata: Metadata = {
  title: "Create Account | ApexCommerce",
  description: "Create your ApexCommerce account to get started",
};

export default function SignupPage() {
  return <AuthForm mode="signup" />;
}
