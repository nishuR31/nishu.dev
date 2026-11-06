import type { RootState } from "@/store/configStore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PortfolioContext {
  [key: string]: any;
}

// Structural schema only — populated dynamically via API fetch
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
    hackerone: "",
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
      state.data = { ...DEFAULT_PORTFOLIO, ...action.payload };
    },

    fetchFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },

    clear(state) {
      Object.assign(state, initialState);
    },
  },
});

export const { fetchStart, fetchSuccess, fetchFailure, clear } = portfolioSlice.actions;

export default portfolioSlice.reducer;

export const portfolioData = (state: RootState) => state.portfolioSlice.data;
export const portfolioLoading = (state: RootState) => state.portfolioSlice.loading;
export const portfolioError = (state: RootState) => state.portfolioSlice.error;
