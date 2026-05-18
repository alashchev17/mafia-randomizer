import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IGameHistory, IGamePhase } from "../models";
import { RoleKey } from "../utils/roleAssets";

interface StatsState {
  phase: IGamePhase;
  counter: number;
  gameLog: IGameHistory[];
}

const initialState: StatsState = {
  phase: IGamePhase.NIGHT,
  counter: 0,
  gameLog: [],
};

export const statsSlice = createSlice({
  name: "stats",
  initialState,
  reducers: {
    advanceCycle: (state) => {
      if (state.phase === IGamePhase.DAY) state.counter += 1;
      state.phase = state.phase === IGamePhase.DAY ? IGamePhase.NIGHT : IGamePhase.DAY;
    },
    logGameEvent: (state, action: PayloadAction<{ playerId: number; playerRole: RoleKey; reasonKey: string }>) => {
      state.gameLog.push({
        playerId: action.payload.playerId,
        playerRole: action.payload.playerRole,
        reason: action.payload.reasonKey,
        timestamp: { phase: state.phase, cycle: state.counter },
      });
    },
    resetStats: () => initialState,
  },
  selectors: {
    selectPhase: (state) => state.phase,
    selectCycle: (state) => state.counter,
    selectGameLog: (state) => state.gameLog,
    selectIsDay: (state) => state.phase === IGamePhase.DAY,
    selectIsNight: (state) => state.phase === IGamePhase.NIGHT,
  },
});

export const { advanceCycle, logGameEvent, resetStats } = statsSlice.actions;
export const { selectPhase, selectCycle, selectGameLog, selectIsDay, selectIsNight } = statsSlice.selectors;

export default statsSlice.reducer;
