import { configureStore } from "@reduxjs/toolkit";
import { sessionSlice } from "./sessionSlice";
import { statsSlice } from "./statsSlice";

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    stats: statsSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
