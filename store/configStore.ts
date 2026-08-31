import { configureStore } from "@reduxjs/toolkit";
import portfolioSlice from "../slices/portfolioSlice";
import themeSlice from "../slices/themeSlice";

// This store is used ONLY to derive types (RootState, AppDispatch).
// The actual runtime store is created per-request in components/reduxProvider.jsx
// via preloadedState to ensure server data seeds client without hydration mismatch.
const _typeStore = configureStore({
    reducer: { portfolioSlice, themeSlice }
});

export type RootState = ReturnType<typeof _typeStore.getState>;
export type AppDispatch = typeof _typeStore.dispatch;
