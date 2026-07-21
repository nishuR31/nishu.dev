import { configureStore } from "@reduxjs/toolkit";
import portfolioSlice from "../slices/portfolioSlice";
import themeSlice from "../slices/themeSlice";

export const store = configureStore({
    reducer: { portfolioSlice, themeSlice }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
