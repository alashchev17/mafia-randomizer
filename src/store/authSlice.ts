import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const TOKEN_STORAGE_KEY = "mafia.authToken";

export type AuthStatus = "idle" | "authenticated" | "guest";

export interface AuthState {
  token: string | null;
  status: AuthStatus;
}

const readPersistedToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_STORAGE_KEY);
};

const persistToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  else window.localStorage.removeItem(TOKEN_STORAGE_KEY);
};

const initialToken = readPersistedToken();

const initialState: AuthState = {
  token: initialToken,
  status: initialToken ? "authenticated" : "guest",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.status = "authenticated";
      persistToken(action.payload);
    },
    clearAuth: (state) => {
      state.token = null;
      state.status = "guest";
      persistToken(null);
    },
  },
  selectors: {
    selectAuthToken: (state) => state.token,
    selectAuthStatus: (state) => state.status,
    selectIsAuthenticated: (state) => state.status === "authenticated",
  },
});

export const { setAuthToken, clearAuth } = authSlice.actions;
export const { selectAuthToken, selectAuthStatus, selectIsAuthenticated } = authSlice.selectors;

export default authSlice.reducer;
