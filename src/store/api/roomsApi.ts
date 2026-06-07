import { baseApi } from "./baseApi";
import type { GameMode, Room } from "../multiplayerSlice";

export interface CreateRoomArgs {
  maxPlayers: number;
  gameMode: GameMode;
}

export interface JoinRoomArgs {
  code: string;
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
    getRoom: build.query<Room, string>({
      query: (roomId) => ({ url: `/rooms/${roomId}` }),
      providesTags: (_r, _e, roomId) => [{ type: "Room", id: roomId }],
    }),
  }),
});

export const { useCreateRoomMutation, useJoinRoomMutation, useGetRoomQuery } = roomsApi;
