import type { RootState } from "./index";

export type WinnerKey = "mafia" | "peaceful" | "premature";

export const selectIsMuted = (id: number) => (state: RootState) => {
  const p = state.session.players[id];
  if (!p || p.mutedSinceCycle === null) return false;
  return state.stats.counter - p.mutedSinceCycle < 2;
};

export const selectWinnerKey = (state: RootState): WinnerKey | null => {
  if (!state.session.initialized) return null;
  const players = Object.values(state.session.players);
  if (players.length === 0) return null;
  const mafiaAlive = players.filter((p) => p.isMafia && p.status === "alive").length;
  const innocentAlive = players.filter((p) => !p.isMafia && p.status === "alive").length;
  if (mafiaAlive < 1) return "peaceful";
  if (mafiaAlive === innocentAlive) return "mafia";
  if (state.session.prematureFinish) return "premature";
  return null;
};

export const selectIsGameOver = (state: RootState) => selectWinnerKey(state) !== null;
