import type { ComponentType, SVGProps } from "react";
import { GoogleIcon, AppleIcon, FacebookIcon, GitHubIcon } from "@/components/ui/SocialIcons";

export type SocialProvider = "google" | "apple" | "facebook" | "github";

export type OAuthStrategyName = `oauth_${SocialProvider}`;

export interface OAuthProviderConfig {
  id: SocialProvider;
  name: string;
  strategy: OAuthStrategyName;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
}

/**
 * Registry of supported OAuth Social Providers in Clerk.
 */
export const SOCIAL_PROVIDERS_MAP: Record<SocialProvider, OAuthProviderConfig> = {
  google: {
    id: "google",
    name: "Google",
    strategy: "oauth_google",
    icon: GoogleIcon,
  },
  apple: {
    id: "apple",
    name: "Apple",
    strategy: "oauth_apple",
    icon: AppleIcon,
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    strategy: "oauth_facebook",
    icon: FacebookIcon,
  },
  github: {
    id: "github",
    name: "GitHub",
    strategy: "oauth_github",
    icon: GitHubIcon,
  },
};
