import { describe, it, expect } from "vitest";
import sessionReducer, {
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
  selectAllPlayers,
  selectInnocentAlive,
  selectIsInstantQueue,
  selectIsVotingPanelOpen,
  selectMafiaAlive,
  selectPlayerOrder,
  selectQueue,
  selectIsKilled,
  selectIsDeleted,
  selectIsQueued,
  selectIsPromoted,
  selectPenaltyCount,
  sessionSlice,
} from "../sessionSlice";
import { IPlayer } from "../../models";
import { ROLES } from "../../utils/roleAssets";

const players: IPlayer[] = [
  { role: ROLES.INNOCENT },
  { role: ROLES.SHERIFF },
  { role: ROLES.MAFIA },
  { role: ROLES.DON },
];

const seeded = () => sessionReducer(sessionSlice.getInitialState(), initializeSession({ players }));

describe("sessionSlice — initializeSession", () => {
  it("builds players record and order keyed from 1", () => {
    const s = seeded();
    expect(s.playerOrder).toEqual([1, 2, 3, 4]);
    expect(s.players[1].role).toBe(ROLES.INNOCENT);
    expect(s.players[1].isMafia).toBe(false);
    expect(s.players[3].isMafia).toBe(true);
    expect(s.players[4].isMafia).toBe(true);
    expect(s.players[2].status).toBe("alive");
    expect(s.players[2].penaltyCount).toBe(0);
    expect(s.players[2].mutedSinceCycle).toBe(null);
    expect(s.initialized).toBe(true);
  });

  it("is idempotent under double dispatch", () => {
    const first = seeded();
    const second = sessionReducer(first, initializeSession({ players: [{ role: ROLES.INNOCENT }] }));
    expect(second).toEqual(first);
  });
});

describe("sessionSlice — lifecycle actions early-return on non-alive", () => {
  it("killPlayer no-ops when already killed", () => {
    let s = seeded();
    s = sessionReducer(s, killPlayer(1));
    const snapshot = s;
    s = sessionReducer(s, killPlayer(1));
    expect(s).toEqual(snapshot);
  });

  it("killPlayer clears mute + penalty", () => {
    let s = seeded();
    s = sessionReducer(s, setPenaltyCount({ playerId: 1, count: 3, currentCycle: 2 }));
    expect(s.players[1].mutedSinceCycle).toBe(2);
    s = sessionReducer(s, killPlayer(1));
    expect(s.players[1].status).toBe("killed");
    expect(s.players[1].mutedSinceCycle).toBe(null);
    expect(s.players[1].penaltyCount).toBe(0);
  });

  it("deletePlayer + markPlayerAsQueued match same shape", () => {
    let s = seeded();
    s = sessionReducer(s, deletePlayer(2));
    expect(s.players[2].status).toBe("deleted");
    s = sessionReducer(s, markPlayerAsQueued(3));
    expect(s.players[3].status).toBe("queued");
  });
});

describe("sessionSlice — queue management", () => {
  it("togglePlayerInQueue is DAY-gated", () => {
    let s = seeded();
    s = sessionReducer(s, togglePlayerInQueue({ id: 1, isDay: false }));
    expect(s.queue).toEqual([]);
    s = sessionReducer(s, togglePlayerInQueue({ id: 1, isDay: true }));
    expect(s.queue).toEqual([1]);
    s = sessionReducer(s, togglePlayerInQueue({ id: 1, isDay: true }));
    expect(s.queue).toEqual([]);
  });

  it("togglePlayerInQueue skips non-alive players", () => {
    let s = seeded();
    s = sessionReducer(s, killPlayer(1));
    s = sessionReducer(s, togglePlayerInQueue({ id: 1, isDay: true }));
    expect(s.queue).toEqual([]);
  });

  it("clearQueue empties the array", () => {
    let s = seeded();
    s = sessionReducer(s, togglePlayerInQueue({ id: 2, isDay: true }));
    s = sessionReducer(s, togglePlayerInQueue({ id: 3, isDay: true }));
    s = sessionReducer(s, clearQueue());
    expect(s.queue).toEqual([]);
  });
});

describe("sessionSlice — penalty + mute", () => {
  it("count===3 sets mutedSinceCycle to currentCycle; else null", () => {
    let s = seeded();
    s = sessionReducer(s, setPenaltyCount({ playerId: 1, count: 2, currentCycle: 5 }));
    expect(s.players[1].mutedSinceCycle).toBe(null);
    expect(s.players[1].penaltyCount).toBe(2);
    s = sessionReducer(s, setPenaltyCount({ playerId: 1, count: 3, currentCycle: 5 }));
    expect(s.players[1].mutedSinceCycle).toBe(5);
    s = sessionReducer(s, setPenaltyCount({ playerId: 1, count: 1, currentCycle: 9 }));
    expect(s.players[1].mutedSinceCycle).toBe(null);
  });
});

describe("sessionSlice — voting panel + premature finish + reset", () => {
  it("voting panel open/close/toggle", () => {
    let s = seeded();
    s = sessionReducer(s, openVotingPanel());
    expect(s.isVotingPanelOpen).toBe(true);
    s = sessionReducer(s, toggleVotingPanel());
    expect(s.isVotingPanelOpen).toBe(false);
    s = sessionReducer(s, closeVotingPanel());
    expect(s.isVotingPanelOpen).toBe(false);
  });

  it("setPrematureFinish flips flag", () => {
    let s = seeded();
    s = sessionReducer(s, setPrematureFinish());
    expect(s.prematureFinish).toBe(true);
  });

  it("resetSession returns to initial", () => {
    let s = seeded();
    s = sessionReducer(s, killPlayer(1));
    s = sessionReducer(s, openVotingPanel());
    s = sessionReducer(s, resetSession());
    expect(s).toEqual(sessionSlice.getInitialState());
  });
});

describe("sessionSlice — selectors", () => {
  const root = () => ({ session: seeded() });

  it("alive counts grouped by isMafia", () => {
    let s = seeded();
    expect(selectMafiaAlive({ session: s })).toBe(2);
    expect(selectInnocentAlive({ session: s })).toBe(2);
    s = sessionReducer(s, killPlayer(3));
    expect(selectMafiaAlive({ session: s })).toBe(1);
    s = sessionReducer(s, killPlayer(4));
    expect(selectMafiaAlive({ session: s })).toBe(0);
  });

  it("selectIsInstantQueue requires queue length 1 AND panel open", () => {
    let s = seeded();
    s = sessionReducer(s, togglePlayerInQueue({ id: 1, isDay: true }));
    expect(selectIsInstantQueue({ session: s })).toBe(false);
    s = sessionReducer(s, openVotingPanel());
    expect(selectIsInstantQueue({ session: s })).toBe(true);
    s = sessionReducer(s, togglePlayerInQueue({ id: 2, isDay: true }));
    expect(selectIsInstantQueue({ session: s })).toBe(false);
  });

  it("parametric status + queue selectors", () => {
    let s = seeded();
    s = sessionReducer(s, killPlayer(1));
    s = sessionReducer(s, deletePlayer(2));
    s = sessionReducer(s, markPlayerAsQueued(3));
    s = sessionReducer(s, togglePlayerInQueue({ id: 4, isDay: true }));
    const r = { session: s };
    expect(selectIsKilled(1)(r)).toBe(true);
    expect(selectIsDeleted(2)(r)).toBe(true);
    expect(selectIsQueued(3)(r)).toBe(true);
    expect(selectIsPromoted(4)(r)).toBe(true);
    expect(selectIsPromoted(1)(r)).toBe(false);
  });

  it("selectAllPlayers / selectPlayerOrder / selectQueue / selectIsVotingPanelOpen / selectPenaltyCount", () => {
    let s = seeded();
    s = sessionReducer(s, setPenaltyCount({ playerId: 1, count: 2, currentCycle: 0 }));
    s = sessionReducer(s, togglePlayerInQueue({ id: 2, isDay: true }));
    s = sessionReducer(s, openVotingPanel());
    const r = { session: s };
    expect(Object.keys(selectAllPlayers(r))).toEqual(["1", "2", "3", "4"]);
    expect(selectPlayerOrder(r)).toEqual([1, 2, 3, 4]);
    expect(selectQueue(r)).toEqual([2]);
    expect(selectIsVotingPanelOpen(r)).toBe(true);
    expect(selectPenaltyCount(1)(r)).toBe(2);
  });

  it("root() helper", () => {
    expect(root().session.initialized).toBe(true);
  });
});
