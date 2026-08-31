"use client";

import { Provider } from "react-redux";
import { store } from "@/store/configStore";
import { fetchSuccess, fetchFailure, fetchStart } from "@/slices/portfolioSlice";
import { useEffect, useRef } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_BACKEND ||
  "https://nishu-dev-api.onrender.com";

export default function Providers({ children, initialData }) {
  const initialized = useRef(false);

  if (!initialized.current && initialData) {
    store.dispatch(fetchSuccess(initialData));
    initialized.current = true;
  }

  useEffect(() => {
    // If initialData was already provided from SSG/SSR, don't trigger blocking refetch
    if (initialized.current) return;
    initialized.current = true;

    async function loadData() {
      store.dispatch(fetchStart());
      try {
        const res = await fetch(`${API_URL}/portfolio`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        store.dispatch(fetchSuccess(json.data ?? json));
      } catch (error) {
        console.warn("Client portfolio fetch notice:", error.message);
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