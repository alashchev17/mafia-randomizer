import { baseApi } from "./baseApi";
import { setAuthToken, clearAuth } from "../authSlice";

export interface PublicUser {
  id: string;
  email: string | null;
  username: string;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  createdAt: string;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
}

export interface AuthResponse {
  user: PublicUser;
  session: AuthSession;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

const persistAuth = async (
  promise: Promise<{ data: AuthResponse }>,
  dispatch: (action: ReturnType<typeof setAuthToken>) => void
) => {
  const { data } = await promise;
  dispatch(setAuthToken(data.session.token));
};

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    register: build.mutation<AuthResponse, RegisterPayload>({
      query: (body) => ({ url: "/auth/register", method: "POST", body }),
      invalidatesTags: ["Me"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await persistAuth(queryFulfilled as Promise<{ data: AuthResponse }>, dispatch);
      },
    }),
    login: build.mutation<AuthResponse, LoginPayload>({
      query: (body) => ({ url: "/auth/login", method: "POST", body }),
      invalidatesTags: ["Me"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await persistAuth(queryFulfilled as Promise<{ data: AuthResponse }>, dispatch);
      },
    }),
    loginTelegram: build.mutation<AuthResponse, { initData: string }>({
      query: (body) => ({ url: "/auth/telegram", method: "POST", body }),
      invalidatesTags: ["Me"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await persistAuth(queryFulfilled as Promise<{ data: AuthResponse }>, dispatch);
      },
    }),
    loginGoogle: build.mutation<AuthResponse, { idToken: string }>({
      query: (body) => ({ url: "/auth/google", method: "POST", body }),
      invalidatesTags: ["Me"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        await persistAuth(queryFulfilled as Promise<{ data: AuthResponse }>, dispatch);
      },
    }),
    me: build.query<PublicUser, void>({
      query: () => ({ url: "/users/me" }),
      providesTags: ["Me"],
    }),
    logout: build.mutation<{ success: boolean }, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      invalidatesTags: ["Me"],
      onQueryStarted: async (_arg, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } finally {
          dispatch(clearAuth());
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLoginTelegramMutation,
  useLoginGoogleMutation,
  useMeQuery,
  useLogoutMutation,
} = authApi;
