"use client";

import { Provider } from "react-redux";
import { store } from "./index";
import type { ReactNode } from "react";

/**
 * Redux Provider — `src/store/provider.tsx`
 *
 * This is a Client Component that wraps the app in the Redux store context.
 * Must be `"use client"` because React-Redux context relies on the React context API.
 *
 * We use `useRef` to avoid re-creating the store on every render.
 * This matters when the Provider is used inside a component that re-renders.
 *
 * Usage in layout:
 *   import { ReduxProvider } from "@/store/provider";
 *   <ReduxProvider>{children}</ReduxProvider>
 */
export function ReduxProvider({ children }: { children: ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
