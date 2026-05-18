import { describe, it, expect } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import sessionReducer, { initializeSession, openVotingPanel, togglePlayerInQueue } from "../sessionSlice";
import statsReducer, { advanceCycle } from "../statsSlice";
import {
  advanceCycleThunk,
  confirmInstantQueueThunk,
  deletePlayerThunk,
  endGamePrematurelyThunk,
  killPlayerThunk,
  queueVoteThunk,
  setPenaltyThunk,
} from "../thunks";
import { IGamePhase, IPlayer } from "../../models";
import { ROLES } from "../../utils/roleAssets";

const players: IPlayer[] = [
  { role: ROLES.INNOCENT },
  { role: ROLES.SHERIFF },
  { role: ROLES.MAFIA },
  { role: ROLES.DON },
];

const makeStore = () => {
  const store = configureStore({ reducer: { session: sessionReducer, stats: statsReducer } });
  store.dispatch(initializeSession({ players }));
  return store;
};

describe("killPlayerThunk", () => {
  it("kills + logs", () => {
    const store = makeStore();
    store.dispatch(killPlayerThunk(3));
    expect(store.getState().session.players[3].status).toBe("killed");
    expect(store.getState().stats.gameLog).toHaveLength(1);
    expect(store.getState().stats.gameLog[0]).toMatchObject({
      playerId: 3,
      playerRole: ROLES.MAFIA,
      reason: "reasons.killed",
    });
  });

  it("no-ops on already-dead player (no duplicate log)", () => {
    const store = makeStore();
    store.dispatch(killPlayerThunk(3));
    store.dispatch(killPlayerThunk(3));
    expect(store.getState().stats.gameLog).toHaveLength(1);
  });
});

describe("deletePlayerThunk + queueVoteThunk", () => {
  it("deletePlayerThunk sets status + logs", () => {
    const store = makeStore();
    store.dispatch(deletePlayerThunk(2));
    expect(store.getState().session.players[2].status).toBe("deleted");
    expect(store.getState().stats.gameLog[0].reason).toBe("reasons.deleted");
  });

  it("queueVoteThunk sets status + logs", () => {
    const store = makeStore();
    store.dispatch(queueVoteThunk(1));
    expect(store.getState().session.players[1].status).toBe("queued");
    expect(store.getState().stats.gameLog[0].reason).toBe("reasons.queued");
  });
});

describe("confirmInstantQueueThunk", () => {
  it("performs all five steps atomically", () => {
    const store = makeStore();
    // Set up: advance to Day, queue one player, open panel.
    store.dispatch(advanceCycle()); // Night → Day
    store.dispatch(togglePlayerInQueue({ id: 1, isDay: true }));
    store.dispatch(openVotingPanel());

    const cycleBefore = store.getState().stats.counter;
    store.dispatch(confirmInstantQueueThunk());

    const s = store.getState();
    expect(s.session.players[1].status).toBe("queued");
    expect(s.stats.gameLog).toHaveLength(1);
    expect(s.stats.gameLog[0].reason).toBe("reasons.singleQueued");
    expect(s.session.queue).toEqual([]);
    expect(s.session.isVotingPanelOpen).toBe(false);
    // advanceCycle from Day → Night bumps counter
    expect(s.stats.phase).toBe(IGamePhase.NIGHT);
    expect(s.stats.counter).toBe(cycleBefore + 1);
  });

  it("no-ops when queue empty", () => {
    const store = makeStore();
    const before = store.getState();
    store.dispatch(confirmInstantQueueThunk());
    expect(store.getState()).toEqual(before);
  });
});

describe("setPenaltyThunk", () => {
  it("reads currentCycle from stats slice", () => {
    const store = makeStore();
    store.dispatch(advanceCycle()); // Day, counter 0
    store.dispatch(advanceCycle()); // Night, counter 1
    store.dispatch(setPenaltyThunk({ playerId: 1, count: 3 }));
    expect(store.getState().session.players[1].mutedSinceCycle).toBe(1);
  });
});

describe("advanceCycleThunk", () => {
  it("Day → Night also clears queue + closes panel", () => {
    const store = makeStore();
    store.dispatch(advanceCycle()); // Night → Day
    store.dispatch(togglePlayerInQueue({ id: 1, isDay: true }));
    store.dispatch(openVotingPanel());
    store.dispatch(advanceCycleThunk()); // Day → Night
    const s = store.getState();
    expect(s.stats.phase).toBe(IGamePhase.NIGHT);
    expect(s.session.queue).toEqual([]);
    expect(s.session.isVotingPanelOpen).toBe(false);
  });

  it("Night → Day preserves queue (queue was empty anyway)", () => {
    const store = makeStore();
    store.dispatch(advanceCycleThunk()); // Night → Day
    expect(store.getState().stats.phase).toBe(IGamePhase.DAY);
  });
});

describe("endGamePrematurelyThunk", () => {
  it("flips prematureFinish flag", () => {
    const store = makeStore();
    store.dispatch(endGamePrematurelyThunk());
    expect(store.getState().session.prematureFinish).toBe(true);
  });
});
