"use client";

import { Provider } from "react-redux";
import { store } from "@/store/configStore";
import { fetchSuccess, fetchFailure, fetchStart } from "@/slices/portfolioSlice";
import { useEffect, useRef } from "react";

export default function Providers({ children }) {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadData() {
      store.dispatch(fetchStart());
      try {
        const api = process.env.NEXT_PUBLIC_API_URL;
        if (!api) throw new Error("Backend is not Integrated Yet !");
        const res = await fetch(`${api}/portfolio`);
        if (!res.ok) throw new Error("Failed to fetch");
        const json = await res.json();
        store.dispatch(fetchSuccess(json.data ?? json));
      } catch (error) {
        store.dispatch(fetchFailure(error.message));
      }
    }

    loadData();
  }, []);

  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}