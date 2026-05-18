import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IPlayer } from "../models";
import { isMafiaRole, RoleKey } from "../utils/roleAssets";

export type PlayerStatus = "alive" | "killed" | "deleted" | "queued";

export interface SessionPlayer {
  id: number;
  role: RoleKey;
  isMafia: boolean;
  status: PlayerStatus;
  penaltyCount: 0 | 1 | 2 | 3;
  mutedSinceCycle: number | null;
}

export interface SessionState {
  players: Record<number, SessionPlayer>;
  playerOrder: number[];
  queue: number[];
  // `isVotingPanelOpen` is the deliberate exception to the "all `isXXX` should be selectors" rule:
  // it is a user toggle (Show/Hide voting button) with no derivation from game state.
  isVotingPanelOpen: boolean;
  prematureFinish: boolean;
  initialized: boolean;
}

const initialState: SessionState = {
  players: {},
  playerOrder: [],
  queue: [],
  isVotingPanelOpen: false,
  prematureFinish: false,
  initialized: false,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    initializeSession: (state, action: PayloadAction<{ players: IPlayer[] }>) => {
      if (state.initialized) return;
      const players: Record<number, SessionPlayer> = {};
      const order: number[] = [];
      action.payload.players.forEach((p, idx) => {
        const id = idx + 1;
        order.push(id);
        players[id] = {
          id,
          role: p.role,
          isMafia: isMafiaRole(p.role),
          status: "alive",
          penaltyCount: 0,
          mutedSinceCycle: null,
        };
      });
      state.players = players;
      state.playerOrder = order;
      state.initialized = true;
    },
    killPlayer: (state, action: PayloadAction<number>) => {
      const p = state.players[action.payload];
      if (!p || p.status !== "alive") return;
      p.status = "killed";
      p.mutedSinceCycle = null;
      p.penaltyCount = 0;
    },
    deletePlayer: (state, action: PayloadAction<number>) => {
      const p = state.players[action.payload];
      if (!p || p.status !== "alive") return;
      p.status = "deleted";
      p.mutedSinceCycle = null;
      p.penaltyCount = 0;
    },
    markPlayerAsQueued: (state, action: PayloadAction<number>) => {
      const p = state.players[action.payload];
      if (!p || p.status !== "alive") return;
      p.status = "queued";
      p.mutedSinceCycle = null;
      p.penaltyCount = 0;
    },
    togglePlayerInQueue: (state, action: PayloadAction<{ id: number; isDay: boolean }>) => {
      if (!action.payload.isDay) return;
      const p = state.players[action.payload.id];
      if (!p || p.status !== "alive") return;
      const idx = state.queue.indexOf(action.payload.id);
      if (idx === -1) state.queue.push(action.payload.id);
      else state.queue.splice(idx, 1);
    },
    clearQueue: (state) => {
      state.queue = [];
    },
    setPenaltyCount: (
      state,
      action: PayloadAction<{ playerId: number; count: 0 | 1 | 2 | 3; currentCycle: number }>
    ) => {
      const p = state.players[action.payload.playerId];
      if (!p) return;
      p.penaltyCount = action.payload.count;
      p.mutedSinceCycle = action.payload.count === 3 ? action.payload.currentCycle : null;
    },
    openVotingPanel: (state) => {
      state.isVotingPanelOpen = true;
    },
    closeVotingPanel: (state) => {
      state.isVotingPanelOpen = false;
    },
    toggleVotingPanel: (state) => {
      state.isVotingPanelOpen = !state.isVotingPanelOpen;
    },
    setPrematureFinish: (state) => {
      state.prematureFinish = true;
    },
    resetSession: () => initialState,
  },
  selectors: {
    selectAllPlayers: (state) => state.players,
    selectPlayerOrder: (state) => state.playerOrder,
    selectQueue: (state) => state.queue,
    selectIsVotingPanelOpen: (state) => state.isVotingPanelOpen,
    selectPrematureFinish: (state) => state.prematureFinish,
    selectIsInitialized: (state) => state.initialized,
    selectIsInstantQueue: (state) => state.queue.length === 1 && state.isVotingPanelOpen,
    selectMafiaAlive: (state) => Object.values(state.players).filter((p) => p.isMafia && p.status === "alive").length,
    selectInnocentAlive: (state) =>
      Object.values(state.players).filter((p) => !p.isMafia && p.status === "alive").length,
  },
});

export const {
  initializeSession,
  killPlayer,
  deletePlayer,
  markPlayerAsQueued,
  togglePlayerInQueue,
  clearQueue,
  setPenaltyCount,
  openVotingPanel,
  closeVotingPanel,
  toggleVotingPanel,
  setPrematureFinish,
  resetSession,
} = sessionSlice.actions;

export const {
  selectAllPlayers,
  selectPlayerOrder,
  selectQueue,
  selectIsVotingPanelOpen,
  selectPrematureFinish,
  selectIsInitialized,
  selectIsInstantQueue,
  selectMafiaAlive,
  selectInnocentAlive,
} = sessionSlice.selectors;

// Parametric selectors take a player id and return a RootState-compatible selector.
// Typed against a structural subset of RootState to avoid a circular type import.
type WithSession = { session: SessionState };

export const selectPlayerById = (id: number) => (state: WithSession) => state.session.players[id];
export const selectIsKilled = (id: number) => (state: WithSession) => state.session.players[id]?.status === "killed";
export const selectIsDeleted = (id: number) => (state: WithSession) => state.session.players[id]?.status === "deleted";
export const selectIsQueued = (id: number) => (state: WithSession) => state.session.players[id]?.status === "queued";
export const selectIsPromoted = (id: number) => (state: WithSession) => state.session.queue.includes(id);
export const selectPenaltyCount = (id: number) => (state: WithSession) => state.session.players[id]?.penaltyCount ?? 0;

export default sessionSlice.reducer;
