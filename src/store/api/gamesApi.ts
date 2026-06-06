import { baseApi } from "./baseApi";
// Reuse the canonical game enums so role/life-status types never drift from
// what the backend sends (e.g. DOCTOR, BANNED).
import type { GameState, GameStatus, GameWinner, LifeStatus, PlayerRole, PlayerTeam } from "../multiplayerSlice";

export type { GameStatus, GameWinner, LifeStatus, PlayerRole, PlayerTeam } from "../multiplayerSlice";

export interface GameSummary {
  id: string;
  status: GameStatus;
  winner: GameWinner | null;
  finishReason: string | null;
  startedAt: string | null;
  finishedAt: string | null;
}

export interface RatingEvent {
  ratingBefore: number;
  ratingAfter: number;
  delta: number;
}

export interface ParticipantView {
  userId: string;
  seatNumber: number;
  role: PlayerRole;
  team: PlayerTeam;
  lifeStatus: LifeStatus;
  won: boolean;
  ratingEvent: RatingEvent | null;
}

export interface GameListItem {
  game: GameSummary;
  participant: ParticipantView;
}

export interface GamesPage {
  items: GameListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface ListGamesArgs {
  userId: string;
  limit?: number;
  offset?: number;
}

export const gamesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    listGames: build.query<GamesPage, ListGamesArgs>({
      query: (args) => ({ url: "/games", params: args }),
      providesTags: (_result, _err, arg) => [{ type: "Game", id: `user-${arg.userId}` }, "Game"],
    }),
    getGame: build.query<GameState, string>({
      query: (gameId) => ({ url: `/games/${gameId}` }),
      providesTags: (_r, _e, gameId) => [{ type: "Game", id: gameId }],
    }),
  }),
});

export const { useListGamesQuery, useGetGameQuery } = gamesApi;
