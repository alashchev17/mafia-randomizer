import type { AppDispatch, RootState } from "./index";
import {
  killPlayer,
  deletePlayer,
  markPlayerAsQueued,
  clearQueue,
  closeVotingPanel,
  setPenaltyCount,
  setPrematureFinish,
} from "./sessionSlice";
import { advanceCycle, logGameEvent } from "./statsSlice";
import { IGamePhase } from "../models";
import { RoleKey } from "../utils/roleAssets";

type Thunk = (dispatch: AppDispatch, getState: () => RootState) => void;

const logEvent = (playerId: number, playerRole: RoleKey, reasonKey: string) => ({
  playerId,
  playerRole,
  reasonKey,
});

export const killPlayerThunk =
  (id: number): Thunk =>
  (dispatch, getState) => {
    const p = getState().session.players[id];
    if (!p || p.status !== "alive") return;
    dispatch(killPlayer(id));
    dispatch(logGameEvent(logEvent(id, p.role, "reasons.killed")));
  };

export const deletePlayerThunk =
  (id: number): Thunk =>
  (dispatch, getState) => {
    const p = getState().session.players[id];
    if (!p || p.status !== "alive") return;
    dispatch(deletePlayer(id));
    dispatch(logGameEvent(logEvent(id, p.role, "reasons.deleted")));
  };

export const queueVoteThunk =
  (id: number): Thunk =>
  (dispatch, getState) => {
    const p = getState().session.players[id];
    if (!p || p.status !== "alive") return;
    dispatch(markPlayerAsQueued(id));
    dispatch(logGameEvent(logEvent(id, p.role, "reasons.queued")));
  };

export const confirmInstantQueueThunk = (): Thunk => (dispatch, getState) => {
  const id = getState().session.queue[0];
  if (id === undefined) return;
  const p = getState().session.players[id];
  if (!p || p.status !== "alive") return;
  dispatch(markPlayerAsQueued(id));
  dispatch(logGameEvent(logEvent(id, p.role, "reasons.singleQueued")));
  dispatch(clearQueue());
  dispatch(closeVotingPanel());
  dispatch(advanceCycle());
};

export const setPenaltyThunk =
  (params: { playerId: number; count: 0 | 1 | 2 | 3 }): Thunk =>
  (dispatch, getState) => {
    dispatch(setPenaltyCount({ ...params, currentCycle: getState().stats.counter }));
  };

export const advanceCycleThunk = (): Thunk => (dispatch, getState) => {
  dispatch(advanceCycle());
  if (getState().stats.phase === IGamePhase.NIGHT) {
    dispatch(clearQueue());
    dispatch(closeVotingPanel());
  }
};

export const endGamePrematurelyThunk = (): Thunk => (dispatch) => {
  dispatch(setPrematureFinish());
};
