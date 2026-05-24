import { configureStore } from "@reduxjs/toolkit";
import { sessionSlice } from "./sessionSlice";
import { statsSlice } from "./statsSlice";
import { authSlice } from "./authSlice";
import { baseApi } from "./api/baseApi";

export const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    stats: statsSlice.reducer,
    auth: authSlice.reducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
