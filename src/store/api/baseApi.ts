import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { clearAuth } from "../authSlice";
import type { RootState } from "../index";

export interface ApiError {
  status: FetchBaseQueryError["status"];
  message: string;
}

const normalizeError = (err: FetchBaseQueryError): ApiError => {
  if ("data" in err && err.data && typeof err.data === "object") {
    const message = (err.data as { message?: unknown }).message;
    if (typeof message === "string") return { status: err.status, message };
    if (Array.isArray(message) && typeof message[0] === "string") {
      return { status: err.status, message: message[0] };
    }
  }
  if ("error" in err && typeof err.error === "string") {
    return { status: err.status, message: err.error };
  }
  return { status: err.status, message: "Request failed" };
};

const rawBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL ?? "http://localhost:3000",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, ApiError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error) {
    if (result.error.status === 401) api.dispatch(clearAuth());
    return { error: normalizeError(result.error) };
  }
  return { data: result.data };
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: ["Me", "Room", "RoomList", "Game", "User", "Leaderboard", "AdminUsers", "RoleWeights"],
  endpoints: () => ({}),
});
