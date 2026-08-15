import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./index";

/**
 * Typed Redux hooks — use these throughout the app instead of
 * the plain `useDispatch` and `useSelector` from react-redux.
 *
 * WHY: The plain hooks have `unknown` / `Dispatch<AnyAction>` types.
 * These typed versions give you full autocomplete and type safety.
 *
 * Usage:
 *   const dispatch = useAppDispatch();
 *   const isCartOpen = useAppSelector((state) => state.ui.isCartOpen);
 */

/** Typed dispatch hook — knows about all registered action types */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/** Typed selector hook — knows the full shape of RootState */
export const useAppSelector = useSelector.withTypes<RootState>();