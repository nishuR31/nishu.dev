import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "@/store/configStore";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeState {
    theme: ThemeMode;
}

const initialState: ThemeState = {
    theme: "dark",
};

const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        setTheme(state, action: PayloadAction<ThemeMode>) {
            state.theme = action.payload;
        },

        resetTheme(state) {
            state.theme = "dark";
        },
    },
});

export const { setTheme, resetTheme } = themeSlice.actions;

export const getTheme = (state: RootState) => state.themeSlice.theme;

export default themeSlice.reducer;