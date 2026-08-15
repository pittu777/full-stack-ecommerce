export type AuthMode = "login" | "signup";

export interface LoginFormValues {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupFormValues {
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  agreeToTerms?: boolean;
}

export type AuthFormValues = LoginFormValues | SignupFormValues;

export interface AuthFormProps {
  mode: AuthMode;
  onSuccess?: () => void;
  redirectTo?: string;
}

export interface AuthCardProps {
  mode: AuthMode;
  children: React.ReactNode;
}

export interface SocialButtonsProps {
  isLoading?: boolean;
  onSocialAuth?: (provider: "google" | "github") => Promise<void> | void;
}
