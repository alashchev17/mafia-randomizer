import { baseApi } from "./baseApi";
import type { PlayerRole } from "../multiplayerSlice";

export interface AdminUser {
  id: string;
  email: string | null;
  username: string;
  avatarUrl: string | null;
  rating: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  isAdmin: boolean;
}

export interface RoleWeight {
  role: PlayerRole;
  weight: number;
}

export interface AdminGame {
  gameId: string;
  role: PlayerRole;
  won: boolean;
  winner: "CITIZENS" | "MAFIA" | null;
  ratingDelta: number;
  finishedAt: string | null;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    adminUsers: build.query<AdminUser[], void>({
      query: () => ({ url: "/admin/users" }),
      providesTags: ["AdminUsers"],
    }),
    userGames: build.query<AdminGame[], string>({
      query: (userId) => ({ url: `/admin/users/${userId}/games` }),
    }),
    roleWeights: build.query<RoleWeight[], string>({
      query: (userId) => ({ url: `/admin/users/${userId}/role-weights` }),
      providesTags: (_r, _e, userId) => [{ type: "RoleWeights", id: userId }],
    }),
    updateRoleWeights: build.mutation<RoleWeight[], { userId: string; weights: RoleWeight[] }>({
      query: ({ userId, weights }) => ({
        url: `/admin/users/${userId}/role-weights`,
        method: "PUT",
        body: { weights },
      }),
      invalidatesTags: (_r, _e, { userId }) => [{ type: "RoleWeights", id: userId }],
    }),
  }),
});

export const { useAdminUsersQuery, useUserGamesQuery, useRoleWeightsQuery, useUpdateRoleWeightsMutation } = adminApi;
