import { RootState } from "@/store/configStore";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface PortfolioContext {
    [key: string]: string;
}

interface PortfolioState {
    data: PortfolioContext | null;
    loading: boolean;
    error: string | null;
}

const initialState: PortfolioState = {
    data: null,
    loading: false,
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
            state.data = action.payload;
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