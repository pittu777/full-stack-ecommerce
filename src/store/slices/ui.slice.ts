import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

/**
 * UI slice — global UI state that doesn't belong to a specific feature.
 *
 * Examples: cart drawer, search panel, sidebar, toast notifications.
 *
 * Feature-specific UI state (e.g. checkout step) should live in
 * a dedicated feature slice (e.g. checkout.slice.ts) rather than here.
 */
interface UIState {
  /** Is the cart drawer open? */
  isCartOpen: boolean;
  /** Is the mobile navigation open? */
  isMobileNavOpen: boolean;
  /** Is the search overlay open? */
  isSearchOpen: boolean;
}

const initialState: UIState = {
  isCartOpen: false,
  isMobileNavOpen: false,
  isSearchOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCart(state) {
      state.isCartOpen = true;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },

    openMobileNav(state) {
      state.isMobileNavOpen = true;
    },
    closeMobileNav(state) {
      state.isMobileNavOpen = false;
    },
    toggleMobileNav(state) {
      state.isMobileNavOpen = !state.isMobileNavOpen;
    },

    openSearch(state) {
      state.isSearchOpen = true;
    },
    closeSearch(state) {
      state.isSearchOpen = false;
    },
    toggleSearch(state) {
      state.isSearchOpen = !state.isSearchOpen;
    },

    /**
     * Close all overlays at once — useful on route change.
     */
    closeAllOverlays(state) {
      state.isCartOpen = false;
      state.isMobileNavOpen = false;
      state.isSearchOpen = false;
    },
  },
});

export const {
  openCart,
  closeCart,
  toggleCart,
  openMobileNav,
  closeMobileNav,
  toggleMobileNav,
  openSearch,
  closeSearch,
  toggleSearch,
  closeAllOverlays,
} = uiSlice.actions;

export default uiSlice.reducer;
