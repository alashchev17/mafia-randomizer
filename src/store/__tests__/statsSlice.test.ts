import { describe, it, expect } from "vitest";
import statsReducer, {
  advanceCycle,
  logGameEvent,
  resetStats,
  selectCycle,
  selectGameLog,
  selectIsDay,
  selectIsNight,
  selectPhase,
  statsSlice,
} from "../statsSlice";
import { IGamePhase } from "../../models";
import { ROLES } from "../../utils/roleAssets";

const init = () => statsSlice.getInitialState();

describe("statsSlice — reducers", () => {
  it("advanceCycle: Night → Day does NOT bump counter", () => {
    const s = statsReducer(init(), advanceCycle());
    expect(s.phase).toBe(IGamePhase.DAY);
    expect(s.counter).toBe(0);
  });

  it("advanceCycle: Day → Night bumps counter by 1", () => {
    const day = statsReducer(init(), advanceCycle());
    const night = statsReducer(day, advanceCycle());
    expect(night.phase).toBe(IGamePhase.NIGHT);
    expect(night.counter).toBe(1);
  });

  it("logGameEvent stamps current phase + cycle from own state", () => {
    let s = init();
    s = statsReducer(s, advanceCycle()); // Day, counter 0
    s = statsReducer(s, advanceCycle()); // Night, counter 1
    s = statsReducer(s, advanceCycle()); // Day, counter 1
    s = statsReducer(s, logGameEvent({ playerId: 3, playerRole: ROLES.MAFIA, reasonKey: "reasons.killed" }));
    expect(s.gameLog).toHaveLength(1);
    expect(s.gameLog[0]).toEqual({
      playerId: 3,
      playerRole: ROLES.MAFIA,
      reason: "reasons.killed",
      timestamp: { phase: IGamePhase.DAY, cycle: 1 },
    });
  });

  it("resetStats returns to initial", () => {
    let s = init();
    s = statsReducer(s, advanceCycle());
    s = statsReducer(s, logGameEvent({ playerId: 1, playerRole: ROLES.INNOCENT, reasonKey: "reasons.queued" }));
    s = statsReducer(s, resetStats());
    expect(s).toEqual(init());
  });
});

describe("statsSlice — selectors", () => {
  it("selectIsDay / selectIsNight reflect phase", () => {
    const rootNight = { stats: init() };
    expect(selectIsNight(rootNight)).toBe(true);
    expect(selectIsDay(rootNight)).toBe(false);
    const rootDay = { stats: statsReducer(init(), advanceCycle()) };
    expect(selectIsDay(rootDay)).toBe(true);
    expect(selectIsNight(rootDay)).toBe(false);
  });

  it("selectPhase / selectCycle / selectGameLog read scalars from slice", () => {
    const root = { stats: init() };
    expect(selectPhase(root)).toBe(IGamePhase.NIGHT);
    expect(selectCycle(root)).toBe(0);
    expect(selectGameLog(root)).toEqual([]);
  });
});
