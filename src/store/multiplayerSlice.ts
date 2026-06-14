import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type PlayerRole = "INNOCENT" | "MAFIA" | "DON" | "SHERIFF" | "DOCTOR" | "PUTANA";
export type PlayerTeam = "CITIZENS" | "MAFIA";
export type LifeStatus = "ALIVE" | "KILLED" | "REMOVED" | "BANNED";
export type ConnectionStatus = "ONLINE" | "OFFLINE" | "LEFT";
export type GamePhase = "LOBBY" | "NIGHT" | "DAY" | "VOTING" | "RESULTS";
export type GameStatus = "WAITING" | "IN_PROGRESS" | "FINISHED" | "CANCELLED";
export type GameMode = "CLASSIC" | "EXTENDED";
export type GameWinner = "CITIZENS" | "MAFIA";
export type RoomStatus = "WAITING" | "IN_GAME" | "FINISHED" | "CANCELLED";
export type NightActionType =
  | "MAFIA_KILL_VOTE"
  | "DON_CHECK_SHERIFF"
  | "SHERIFF_CHECK"
  | "DOCTOR_PROTECT"
  | "ROLEBLOCK";

export interface RoomPlayer {
  userId: string;
  username: string;
  avatarUrl: string | null;
  seatNumber: number;
  isHost: boolean;
  isReady: boolean;
  connectionStatus: ConnectionStatus;
  leftAt: string | null;
}

export interface Room {
  id: string;
  code: string;
  status: RoomStatus;
  gameMode: GameMode;
  maxPlayers: number;
  hostId: string;
  host: { id: string; username: string; avatarUrl: string | null };
  players: RoomPlayer[];
  gameId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GameSeat {
  userId: string;
  username: string;
  avatarUrl: string | null;
  seatNumber: number;
  lifeStatus: LifeStatus;
  connectionStatus: ConnectionStatus;
  penaltyCount: number;
  mutedSinceCycle: number | null;
  role: PlayerRole | null;
  team: PlayerTeam | null;
}

export interface Nomination {
  actorSeat: number;
  targetSeat: number;
}

export interface Vote {
  actorSeat: number;
  targetSeat: number | null;
}

export interface GameState {
  id: string;
  roomId: string;
  status: GameStatus;
  phase: GamePhase;
  cycle: number;
  speakerSeat: number | null;
  winner: GameWinner | null;
  finishReason: string | null;
  hostId: string;
  hostUsername: string;
  hostAvatarUrl: string | null;
  seats: GameSeat[];
  currentNominations: Nomination[];
  currentVotes: Vote[];
}

export interface CheckResult {
  targetSeat: number;
  // role: the checked player's exact role (sheriff/don checks). Drives the
  // card-flip reveal. May be absent on older payloads.
  result: { isMafia?: boolean; isSheriff?: boolean; role?: PlayerRole };
  cycle: number;
}

export interface FinishPayload {
  winner: GameWinner | null;
  finishReason: string;
  ratingDeltas: { userId: string; delta: number; ratingBefore: number; ratingAfter: number }[];
}

export type SocketStatus = "idle" | "connecting" | "connected" | "disconnected";

export type ChatChannel = "GENERAL" | "MAFIA" | "DEAD";

export interface ChatMessage {
  id: string;
  channel: ChatChannel;
  userId: string;
  username: string;
  text: string;
  createdAt: string;
}

export interface LogEntry {
  id: string;
  type: string;
  phase: GamePhase;
  cycle: number;
  payload: Record<string, unknown> | null;
  createdAt: string;
}

export interface TimerState {
  state: "idle" | "running";
  endsAt: number | null;
  serverOffset: number;
}

interface MultiplayerState {
  socketStatus: SocketStatus;
  activeRoomId: string | null;
  activeGameId: string | null;
  room: Room | null;
  game: GameState | null;
  privateChecks: CheckResult[];
  myNightAction: { type: NightActionType; targetSeat: number } | null;
  // My last *committed* night action, kept across the phase change so the FE can
  // hide the "same target two nights running" button for doctor/putana.
  lastNightAction: { type: NightActionType; targetSeat: number; cycle: number } | null;
  // The cycle whose day I should show the "you were visited" marker for.
  myVisitedCycle: number | null;
  // The night role/team the host has handed the floor to ("дать ход"); gates
  // who may act this turn.
  nightFloor: NightActionType | null;
  // Host-only: every player's locked night choice for the current cycle.
  nightChoices: { actorSeat: number; type: NightActionType; targetSeat: number }[];
  chat: ChatMessage[];
  log: LogEntry[];
  timer: TimerState;
  lastFinish: FinishPayload | null;
  lastError: string | null;
  roomClosed: boolean;
}

const initialTimer: TimerState = { state: "idle", endsAt: null, serverOffset: 0 };

const initialState: MultiplayerState = {
  socketStatus: "idle",
  activeRoomId: null,
  activeGameId: null,
  room: null,
  game: null,
  privateChecks: [],
  myNightAction: null,
  lastNightAction: null,
  myVisitedCycle: null,
  nightFloor: null,
  nightChoices: [],
  chat: [],
  log: [],
  timer: initialTimer,
  lastFinish: null,
  lastError: null,
  roomClosed: false,
};

export const multiplayerSlice = createSlice({
  name: "multiplayer",
  initialState,
  reducers: {
    setSocketStatus: (state, action: PayloadAction<SocketStatus>) => {
      state.socketStatus = action.payload;
    },
    resetMultiplayer: () => initialState,
    setActiveRoomId: (state, action: PayloadAction<string | null>) => {
      state.activeRoomId = action.payload;
      if (action.payload === null) {
        state.activeGameId = null;
        state.room = null;
        state.game = null;
        state.privateChecks = [];
        state.myNightAction = null;
        state.lastNightAction = null;
        state.myVisitedCycle = null;
        state.nightFloor = null;
        state.nightChoices = [];
        state.chat = [];
        state.log = [];
        state.timer = { state: "idle", endsAt: null, serverOffset: 0 };
        state.lastFinish = null;
        state.lastError = null;
        state.roomClosed = false;
      }
    },
    applyRoomSnapshot: (state, action: PayloadAction<Room>) => {
      state.room = action.payload;
      state.activeGameId = action.payload.gameId;
      state.game = null;
      state.roomClosed = false;
    },
    applyRoomClosed: (state) => {
      state.roomClosed = true;
      state.room = null;
      state.game = null;
      state.activeGameId = null;
    },
    applyGameSnapshot: (state, action: PayloadAction<GameState>) => {
      // A snapshot for a different game (rejoin/resync) must not inherit the
      // previous game's private checks.
      if (action.payload.id !== state.activeGameId) state.privateChecks = [];
      state.game = action.payload;
      state.activeGameId = action.payload.id;
      state.myNightAction = null;
      state.lastNightAction = null;
      state.myVisitedCycle = null;
      state.nightFloor = null;
      state.nightChoices = [];
    },
    applyRoomPlayerJoined: (state, action: PayloadAction<RoomPlayer>) => {
      if (!state.room) return;
      const i = state.room.players.findIndex((p) => p.userId === action.payload.userId);
      if (i >= 0) state.room.players[i] = action.payload;
      else state.room.players.push(action.payload);
    },
    applyRoomPlayerLeft: (state, action: PayloadAction<{ userId: string }>) => {
      if (!state.room) return;
      state.room.players = state.room.players.filter((p) => p.userId !== action.payload.userId);
    },
    applyRoomPlayerReady: (state, action: PayloadAction<{ userId: string; isReady: boolean }>) => {
      if (!state.room) return;
      const p = state.room.players.find((p) => p.userId === action.payload.userId);
      if (p) p.isReady = action.payload.isReady;
    },
    applyRoomPlayerConnectionChanged: (
      state,
      action: PayloadAction<{ userId: string; connectionStatus: ConnectionStatus }>
    ) => {
      const list = state.room?.players;
      if (list) {
        const p = list.find((p) => p.userId === action.payload.userId);
        if (p) p.connectionStatus = action.payload.connectionStatus;
      }
      const seats = state.game?.seats;
      if (seats) {
        const seat = seats.find((s) => s.userId === action.payload.userId);
        if (seat) seat.connectionStatus = action.payload.connectionStatus;
      }
    },
    applyRoomStarted: (state, action: PayloadAction<{ gameId: string }>) => {
      state.activeGameId = action.payload.gameId;
      if (state.room) state.room.gameId = action.payload.gameId;
      state.chat = [];
    },
    applyPhaseChanged: (state, action: PayloadAction<{ phase: GamePhase; cycle: number }>) => {
      if (!state.game) return;
      const cycleChanged = state.game.cycle !== action.payload.cycle;
      state.game.phase = action.payload.phase;
      state.game.cycle = action.payload.cycle;
      state.game.speakerSeat = null;
      state.myNightAction = null;
      state.nightFloor = null;
      // The visited marker only shows during the day after the visit; once a new
      // night begins it's stale, so clear it.
      if (action.payload.phase === "NIGHT") state.myVisitedCycle = null;
      if (cycleChanged) {
        state.game.currentNominations = [];
        state.game.currentVotes = [];
        state.nightChoices = [];
      }
    },
    applySpeaker: (state, action: PayloadAction<{ speakerSeat: number | null }>) => {
      if (!state.game) return;
      state.game.speakerSeat = action.payload.speakerSeat;
    },
    applyNominated: (state, action: PayloadAction<Nomination>) => {
      if (!state.game) return;
      state.game.currentNominations.push(action.payload);
    },
    applyVoteCast: (state, action: PayloadAction<Vote>) => {
      if (!state.game) return;
      const i = state.game.currentVotes.findIndex((v) => v.actorSeat === action.payload.actorSeat);
      if (action.payload.targetSeat === null) {
        if (i >= 0) state.game.currentVotes.splice(i, 1);
      } else if (i >= 0) {
        state.game.currentVotes[i] = action.payload;
      } else {
        state.game.currentVotes.push(action.payload);
      }
    },
    applyVotingResult: (state, action: PayloadAction<{ targetSeat: number | null; isTie: boolean }>) => {
      if (!state.game) return;
      if (action.payload.isTie || action.payload.targetSeat === null) return;
      const seat = state.game.seats.find((s) => s.seatNumber === action.payload.targetSeat);
      if (seat) seat.lifeStatus = "REMOVED";
    },
    applyNightResult: (state, action: PayloadAction<{ killedSeat: number | null }>) => {
      if (!state.game) return;
      if (action.payload.killedSeat !== null) {
        const seat = state.game.seats.find((s) => s.seatNumber === action.payload.killedSeat);
        if (seat) seat.lifeStatus = "KILLED";
      }
    },
    applyCheckResult: (
      state,
      action: PayloadAction<{ targetSeat: number; result: CheckResult["result"]; cycle?: number }>
    ) => {
      if (!state.game) return;
      // Prefer the cycle the server stamped the check with; the local cycle can
      // already have advanced by the time a delayed ack arrives.
      const { cycle, ...check } = action.payload;
      state.privateChecks.push({ ...check, cycle: cycle ?? state.game.cycle });
    },
    applyPlayerStatusChanged: (
      state,
      action: PayloadAction<{
        targetSeat: number;
        penaltyCount?: number;
        lifeStatus?: LifeStatus;
        mutedSinceCycle?: number | null;
      }>
    ) => {
      const seat = state.game?.seats.find((s) => s.seatNumber === action.payload.targetSeat);
      if (!seat) return;
      if (action.payload.penaltyCount !== undefined) {
        seat.penaltyCount = action.payload.penaltyCount;
      }
      if (action.payload.lifeStatus) seat.lifeStatus = action.payload.lifeStatus;
      if (action.payload.mutedSinceCycle !== undefined) {
        seat.mutedSinceCycle = action.payload.mutedSinceCycle;
      }
    },
    applyGameFinished: (state, action: PayloadAction<Omit<FinishPayload, "ratingDeltas"> & Partial<FinishPayload>>) => {
      // Normalize ratingDeltas so consumers can always iterate it; a finish
      // event without rating (e.g. host-terminated games) would otherwise
      // leave it undefined and break .find/.map.
      state.lastFinish = { ...action.payload, ratingDeltas: action.payload.ratingDeltas ?? [] };
      // The game is over: drop the active-game pointer so the lobby (which
      // redirects to the game whenever activeGameId is set) doesn't bounce the
      // player straight back here after the return-to-lobby navigation.
      state.activeGameId = null;
      if (state.game) {
        state.game.status = "FINISHED";
        state.game.phase = "RESULTS";
        state.game.winner = action.payload.winner;
        state.game.finishReason = action.payload.finishReason;
      }
    },
    applyNightActionAck: (state, action: PayloadAction<{ type: NightActionType; targetSeat: number }>) => {
      state.myNightAction = action.payload;
      // Remember the committed target (stamped with the current cycle) so the
      // "no same target two nights" guard can hide that seat's button next night.
      state.lastNightAction = { ...action.payload, cycle: state.game?.cycle ?? 0 };
    },
    applyVisited: (state, action: PayloadAction<{ cycle: number }>) => {
      state.myVisitedCycle = action.payload.cycle;
    },
    applyNightFloor: (state, action: PayloadAction<{ actionType: NightActionType | null }>) => {
      state.nightFloor = action.payload.actionType;
    },
    applyNightChoice: (
      state,
      action: PayloadAction<{ actorSeat: number; type: NightActionType; targetSeat: number }>
    ) => {
      const i = state.nightChoices.findIndex(
        (c) => c.actorSeat === action.payload.actorSeat && c.type === action.payload.type
      );
      if (i >= 0) state.nightChoices[i] = action.payload;
      else state.nightChoices.push(action.payload);
    },
    applyChatHistory: (state, action: PayloadAction<ChatMessage[]>) => {
      state.chat = action.payload;
    },
    applyChatMessage: (state, action: PayloadAction<ChatMessage>) => {
      if (state.chat.some((m) => m.id === action.payload.id)) return;
      state.chat.push(action.payload);
    },
    applyLog: (state, action: PayloadAction<LogEntry[]>) => {
      state.log = action.payload;
    },
    applyTimer: (
      state,
      action: PayloadAction<{
        state: "idle" | "running";
        endsAt: number | null;
        serverOffset: number;
      }>
    ) => {
      state.timer = {
        state: action.payload.state,
        endsAt: action.payload.state === "running" ? action.payload.endsAt : null,
        serverOffset: action.payload.serverOffset,
      };
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.lastError = action.payload;
    },
  },
  selectors: {
    selectMultiplayer: (state) => state,
    selectRoom: (state) => state.room,
    selectGame: (state) => state.game,
    selectActiveGameId: (state) => state.activeGameId,
    selectSocketStatus: (state) => state.socketStatus,
    selectPrivateChecks: (state) => state.privateChecks,
    selectMyNightAction: (state) => state.myNightAction,
    selectLastNightAction: (state) => state.lastNightAction,
    selectMyVisitedCycle: (state) => state.myVisitedCycle,
    selectNightFloor: (state) => state.nightFloor,
    selectNightChoices: (state) => state.nightChoices,
    selectChat: (state) => state.chat,
    selectLog: (state) => state.log,
    selectTimer: (state) => state.timer,
    selectLastFinish: (state) => state.lastFinish,
    selectRoomClosed: (state) => state.roomClosed,
  },
});

export const {
  setSocketStatus,
  resetMultiplayer,
  setActiveRoomId,
  applyRoomSnapshot,
  applyRoomClosed,
  applyGameSnapshot,
  applyRoomPlayerJoined,
  applyRoomPlayerLeft,
  applyRoomPlayerReady,
  applyRoomPlayerConnectionChanged,
  applyRoomStarted,
  applyPhaseChanged,
  applySpeaker,
  applyNominated,
  applyVoteCast,
  applyVotingResult,
  applyNightResult,
  applyCheckResult,
  applyPlayerStatusChanged,
  applyGameFinished,
  applyNightActionAck,
  applyVisited,
  applyNightFloor,
  applyNightChoice,
  applyChatHistory,
  applyChatMessage,
  applyLog,
  applyTimer,
  setError,
} = multiplayerSlice.actions;

export const {
  selectMultiplayer,
  selectRoom,
  selectGame,
  selectActiveGameId,
  selectSocketStatus,
  selectPrivateChecks,
  selectMyNightAction,
  selectLastNightAction,
  selectMyVisitedCycle,
  selectNightFloor,
  selectNightChoices,
  selectChat,
  selectLog,
  selectTimer,
  selectLastFinish,
  selectRoomClosed,
} = multiplayerSlice.selectors;

export default multiplayerSlice.reducer;
