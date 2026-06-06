import { baseApi } from "./baseApi";
import type { GameMode, GameState, Room } from "../multiplayerSlice";

export interface CreateRoomArgs {
  maxPlayers: number;
  gameMode: GameMode;
}

export interface JoinRoomArgs {
  code: string;
}

export interface StartRoomResponse {
  room: Room;
  gameId: string;
}

export const roomsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    createRoom: build.mutation<Room, CreateRoomArgs>({
      query: (body) => ({ url: "/rooms", method: "POST", body }),
      invalidatesTags: ["Room"],
    }),
    joinRoom: build.mutation<Room, JoinRoomArgs>({
      query: (body) => ({ url: "/rooms/join", method: "POST", body }),
      invalidatesTags: ["Room"],
    }),
    leaveRoom: build.mutation<Room, { roomId: string }>({
      query: ({ roomId }) => ({
        url: `/rooms/${roomId}/leave`,
        method: "POST",
      }),
      invalidatesTags: ["Room"],
    }),
    getRoom: build.query<Room, string>({
      query: (roomId) => ({ url: `/rooms/${roomId}` }),
      providesTags: (_r, _e, roomId) => [{ type: "Room", id: roomId }],
    }),
    startRoom: build.mutation<StartRoomResponse, { roomId: string }>({
      query: ({ roomId }) => ({
        url: `/rooms/${roomId}/start`,
        method: "POST",
      }),
      invalidatesTags: ["Room", "Game"],
    }),
    getGame: build.query<GameState, string>({
      query: (gameId) => ({ url: `/games/${gameId}` }),
      providesTags: (_r, _e, gameId) => [{ type: "Game", id: gameId }],
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useJoinRoomMutation,
  useLeaveRoomMutation,
  useGetRoomQuery,
  useStartRoomMutation,
  useGetGameQuery,
} = roomsApi;
