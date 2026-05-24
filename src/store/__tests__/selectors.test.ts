import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import sessionReducer, { initializeSession, killPlayer, setPenaltyCount, setPrematureFinish } from "../sessionSlice";
import statsReducer, { advanceCycle } from "../statsSlice";
import authReducer from "../authSlice";
import { baseApi } from "../api/baseApi";
import { selectIsGameOver, selectIsMuted, selectWinnerKey } from "../selectors";
import { IPlayer } from "../../models";
import { ROLES } from "../../utils/roleAssets";

// 6-player realistic distribution: 4 innocent (3 peaceful + sheriff), 2 mafia (mafia + don).
// Avoids the equality-at-init edge case that doesn't occur in actual `roleDistribution` output.
const players: IPlayer[] = [
  { role: ROLES.INNOCENT },
  { role: ROLES.INNOCENT },
  { role: ROLES.INNOCENT },
  { role: ROLES.SHERIFF },
  { role: ROLES.MAFIA },
  { role: ROLES.DON },
];

const makeStore = () => {
  const store = configureStore({
    reducer: {
      session: sessionReducer,
      stats: statsReducer,
      auth: authReducer,
      [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
  });
  store.dispatch(initializeSession({ players }));
  return store;
};

describe("selectIsMuted — cross-slice derivation", () => {
  it("false when player has no mutedSinceCycle", () => {
    const store = makeStore();
    expect(selectIsMuted(1)(store.getState())).toBe(false);
  });

  it("true while currentCycle - mutedSinceCycle < 2", () => {
    const store = makeStore();
    // Get to Day, cycle 0 still
    store.dispatch(advanceCycle());
    store.dispatch(setPenaltyCount({ playerId: 1, count: 3, currentCycle: store.getState().stats.counter }));
    expect(selectIsMuted(1)(store.getState())).toBe(true);
    // Advance Day → Night: counter goes 0 → 1. Diff = 1, still muted.
    store.dispatch(advanceCycle());
    expect(selectIsMuted(1)(store.getState())).toBe(true);
    // Advance Night → Day: counter stays 1 (only DAY→NIGHT bumps). Diff still 1.
    store.dispatch(advanceCycle());
    expect(selectIsMuted(1)(store.getState())).toBe(true);
    // Advance Day → Night again: counter 1 → 2. Diff = 2 → not muted.
    store.dispatch(advanceCycle());
    expect(selectIsMuted(1)(store.getState())).toBe(false);
  });

  it("false for unknown player id", () => {
    const store = makeStore();
    expect(selectIsMuted(999)(store.getState())).toBe(false);
  });
});

describe("selectWinnerKey", () => {
  it("null while game ongoing", () => {
    const store = makeStore();
    expect(selectWinnerKey(store.getState())).toBe(null);
    expect(selectIsGameOver(store.getState())).toBe(false);
  });

  it("'peaceful' when all mafia dead", () => {
    const store = makeStore();
    // Mafia are players 5 and 6 in the fixture.
    store.dispatch(killPlayer(5));
    store.dispatch(killPlayer(6));
    expect(selectWinnerKey(store.getState())).toBe("peaceful");
    expect(selectIsGameOver(store.getState())).toBe(true);
  });

  it("'mafia' when mafia count equals innocent count", () => {
    const store = makeStore();
    // Start: 4 innocent, 2 mafia. Kill 2 innocents → 2 vs 2.
    store.dispatch(killPlayer(1));
    expect(selectWinnerKey(store.getState())).toBe(null);
    store.dispatch(killPlayer(2));
    expect(selectWinnerKey(store.getState())).toBe("mafia");
  });

  it("'premature' when prematureFinish flagged and no natural condition met", () => {
    const store = makeStore();
    store.dispatch(setPrematureFinish());
    expect(selectWinnerKey(store.getState())).toBe("premature");
  });

  it("natural condition wins over premature flag", () => {
    const store = makeStore();
    store.dispatch(killPlayer(5));
    store.dispatch(killPlayer(6));
    store.dispatch(setPrematureFinish());
    expect(selectWinnerKey(store.getState())).toBe("peaceful");
  });

  it("null when session not initialized", () => {
    const store = configureStore({
      reducer: {
        session: sessionReducer,
        stats: statsReducer,
        auth: authReducer,
        [baseApi.reducerPath]: baseApi.reducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApi.middleware),
    });
    expect(selectWinnerKey(store.getState())).toBe(null);
  });
});
