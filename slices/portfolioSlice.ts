import { RootState } from "@/store/configStore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PortfolioContext {
    [key: string]: any;
}

// Default shape ensures components never crash on null access, now hydrated by client fetch
export const DEFAULT_PORTFOLIO: PortfolioContext = {
    developer: {
        name: "",
        shortName: "",
        role: "",
        tagline: "",
        bio: "",
        email: "",
        location: "",
        about: [],
    },
    social: {
        email: "",
        github: "",
        linkedin: "",
        discord: "",
        twitter: "",
        leetcode: "",
        hackerone: ""
    },
    NAV_ITEMS: [],
    projects: [],
    skills: [],
    experiences: [],
    certificates: [],
    featuredProjects: [],
    keywords: "portfolio,developer",
    recentTracks: false,
};

interface PortfolioState {
    data: PortfolioContext;
    loading: boolean;
    error: string | null;
}

const initialState: PortfolioState = {
    data: DEFAULT_PORTFOLIO,
    loading: true,
    error: null,
};

const portfolioSlice = createSlice({
    name: "portfolio",
    initialState,
    reducers: {
        fetchStart(state) {
            state.loading = true;
            state.error = null;
        },

        fetchSuccess(state, action: PayloadAction<PortfolioContext>) {
            state.loading = false;
            // Merge with defaults so any missing keys still have safe values
            state.data = { ...DEFAULT_PORTFOLIO, ...action.payload };
        },

        fetchFailure(state, action: PayloadAction<string>) {
            state.loading = false;
            state.error = action.payload;
            // Keep data as DEFAULT_PORTFOLIO (already set in initialState)
        },

        clear(state) {
            Object.assign(state, initialState);
        },
    },
});

export const {
    fetchStart,
    fetchSuccess,
    fetchFailure,
    clear,
} = portfolioSlice.actions;

export default portfolioSlice.reducer;


export const portfolioData = (state: RootState) => state.portfolioSlice.data;
export const portfolioLoading = (state: RootState) =>
    state.portfolioSlice.loading;
export const portfolioError = (state: RootState) =>
    state.portfolioSlice.error;