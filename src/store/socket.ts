import { io, Socket } from "socket.io-client";
import type { AppDispatch } from ".";
import { baseApi } from "./api/baseApi";
import { pushNotification } from "./notificationSlice";
import {
  applyCheckResult,
  applyGameFinished,
  applyGameSnapshot,
  applyLog,
  applyNightActionAck,
  applyNightResult,
  applyNominated,
  applyPhaseChanged,
  applyPlayerStatusChanged,
  applyRoomPlayerDisconnected,
  applyRoomPlayerJoined,
  applyRoomPlayerLeft,
  applyRoomPlayerReady,
  applyRoomSnapshot,
  applyRoomStarted,
  applyTimer,
  applyVoteCast,
  applyVotingResult,
  setError,
  setSocketStatus,
  type GameState,
  type LogEntry,
  type Nomination,
  type NightActionType,
  type Room,
  type RoomPlayer,
  type Vote,
} from "./multiplayerSlice";

let socket: Socket | null = null;
// Room the client wants to be in. Tracked so we can re-join after a reconnect,
// since the server drops room membership when the socket drops.
let joinedRoomId: string | null = null;

interface RoomStatePayload {
  kind: "lobby" | "game";
  room?: Room;
  state?: GameState;
}

const SOCKET_URL = (() => {
  const base = import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/game`;
})();

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(token: string, dispatch: AppDispatch): Socket {
  if (socket?.connected) return socket;
  dispatch(setSocketStatus("connecting"));
  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
  });

  socket.on("connect", () => {
    dispatch(setSocketStatus("connected"));
    // Re-join after a fresh connect or a reconnect; emits made while the
    // socket was down (or not yet created) would otherwise be lost.
    if (joinedRoomId) socket?.emit("room:join", { roomId: joinedRoomId });
  });
  socket.on("disconnect", () => dispatch(setSocketStatus("disconnected")));
  socket.on("connect_error", (err) => {
    dispatch(setSocketStatus("disconnected"));
    dispatch(setError(err.message));
  });

  socket.on("game:error", (payload: { message: string }) => {
    dispatch(setError(payload.message));
    dispatch(pushNotification(payload.message));
  });

  socket.on("room:state", (payload: RoomStatePayload) => {
    if (payload.kind === "lobby" && payload.room) {
      dispatch(applyRoomSnapshot(payload.room));
    } else if (payload.kind === "game" && payload.state) {
      dispatch(applyGameSnapshot(payload.state));
    }
  });
  socket.on("room:player-joined", (player: RoomPlayer) => dispatch(applyRoomPlayerJoined(player)));
  socket.on("room:player-left", (p: { userId: string }) => dispatch(applyRoomPlayerLeft(p)));
  socket.on("room:player-ready", (p: { userId: string; isReady: boolean }) => dispatch(applyRoomPlayerReady(p)));
  socket.on("room:player-disconnected", (p: { userId: string; connectionStatus: RoomPlayer["connectionStatus"] }) =>
    dispatch(applyRoomPlayerDisconnected(p))
  );
  socket.on("room:player-connected", (p: { userId: string; connectionStatus: RoomPlayer["connectionStatus"] }) =>
    dispatch(applyRoomPlayerDisconnected(p))
  );
  socket.on("room:started", (p: { gameId: string }) => dispatch(applyRoomStarted(p)));

  socket.on("game:phase-changed", (p: { phase: GameState["phase"]; cycle: number }) => dispatch(applyPhaseChanged(p)));
  socket.on("game:nominated", (p: Nomination) => dispatch(applyNominated(p)));
  socket.on("game:vote-cast", (p: Vote) => dispatch(applyVoteCast(p)));
  socket.on("game:voting-result", (p: { targetSeat: number | null; isTie: boolean }) => dispatch(applyVotingResult(p)));
  socket.on("game:night-result", (p: { killedSeat: number | null }) => dispatch(applyNightResult(p)));
  socket.on("game:check-result", (p: { targetSeat: number; result: { isMafia?: boolean; isSheriff?: boolean } }) =>
    dispatch(applyCheckResult(p))
  );
  socket.on("game:player-status-changed", (p: Parameters<typeof applyPlayerStatusChanged>[0]) =>
    dispatch(applyPlayerStatusChanged(p))
  );
  socket.on("game:finished", (p: Parameters<typeof applyGameFinished>[0]) => {
    dispatch(applyGameFinished(p));
    dispatch(baseApi.util.invalidateTags(["Me", "Game", "Room"]));
  });

  socket.on("game:night-action-ack", (p: { type: NightActionType; targetSeat: number }) =>
    dispatch(applyNightActionAck(p))
  );
  socket.on("game:log", (entries: LogEntry[]) => dispatch(applyLog(entries)));
  socket.on("game:timer", (p: { state: "idle" | "running"; endsAt?: number; serverNow: number }) =>
    dispatch(
      applyTimer({
        state: p.state,
        endsAt: p.endsAt ?? null,
        serverOffset: p.serverNow - Date.now(),
      })
    )
  );

  return socket;
}

export function disconnectSocket(dispatch: AppDispatch): void {
  joinedRoomId = null;
  if (!socket) return;
  socket.disconnect();
  socket = null;
  dispatch(setSocketStatus("idle"));
}

export function emit<T>(event: string, payload: T): void {
  socket?.emit(event, payload);
}

export const SocketEvents = {
  roomJoin: (roomId: string) => {
    joinedRoomId = roomId;
    emit("room:join", { roomId });
  },
  roomLeave: (roomId: string) => {
    if (joinedRoomId === roomId) joinedRoomId = null;
    emit("room:leave", { roomId });
  },
  roomReady: (roomId: string, isReady: boolean) => emit("room:ready", { roomId, isReady }),
  roomStart: (roomId: string) => emit("room:start", { roomId }),
  nominate: (gameId: string, targetSeat: number) => emit("game:nominate", { gameId, targetSeat }),
  vote: (gameId: string, targetSeat: number | null) => emit("game:vote", { gameId, targetSeat }),
  nightAction: (gameId: string, type: NightActionType, targetSeat: number) =>
    emit("game:night-action", { gameId, type, targetSeat }),
  advancePhase: (gameId: string) => emit("game:advance-phase", { gameId }),
  hostPenalty: (gameId: string, targetSeat: number, delta: 1 | -1) =>
    emit("game:host-penalty", { gameId, targetSeat, delta }),
  hostNominate: (gameId: string, targetSeat: number) => emit("game:host-nominate", { gameId, targetSeat }),
  hostVoteResult: (gameId: string, targetSeat: number | null) => emit("game:host-vote-result", { gameId, targetSeat }),
  hostNightKill: (gameId: string, targetSeat: number | null) => emit("game:host-night-kill", { gameId, targetSeat }),
  hostFinish: (gameId: string) => emit("game:host-finish", { gameId }),
  timerStart: (gameId: string, durationMs: number) => emit("game:host-timer-start", { gameId, durationMs }),
  timerSkip: (gameId: string) => emit("game:host-timer-skip", { gameId }),
};
