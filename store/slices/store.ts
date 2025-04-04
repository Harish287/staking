import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./index";
import tokenAuthReducer from "./tokenAuth";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    tokenAuth: tokenAuthReducer, 
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
