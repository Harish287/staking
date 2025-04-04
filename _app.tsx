import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/slices/store";
import ProtectedRoute from "./app/ProtectedRoute";

export default function MyApp({ Component, pageProps }: any) {
  return (
    <ProtectedRoute>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ProtectedRoute>
  );
}
