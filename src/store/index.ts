import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "./slices/ui.slice";

/**
 * Redux store — `src/store/index.ts`
 *
 * What belongs in Redux (per README Section 20):
 *   ✅ Cart UI state (drawer open/closed)
 *   ✅ Checkout UI state (step tracking)
 *   ✅ Filter state (selected filters, price range)
 *   ✅ Modal / sidebar state
 *   ✅ Client preferences
 *
 * What does NOT belong in Redux:
 *   ❌ Auth session state — Clerk owns this via its own hooks/context
 *   ❌ Server-fetched data — use Server Components or RTK Query instead
 *
 * RTK Query APIs will be added here when client-side fetching is needed:
 *   e.g. import { productsApi } from "./services/products.api";
 *        middleware: (getDefaultMiddleware) =>
 *          getDefaultMiddleware().concat(productsApi.middleware),
 */
export const store = configureStore({
  reducer: {
    ui: uiReducer,
    // Future slices:
    // cart: cartReducer,
    // checkout: checkoutReducer,
    // filters: filtersReducer,

    // Future RTK Query APIs:
    // [productsApi.reducerPath]: productsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Disable serializable check for now.
      // Re-enable and configure when adding RTK Query or Date values to state.
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

// Infer RootState and AppDispatch types from the store itself.
// These are used in typed hooks (store/hooks.ts).
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
