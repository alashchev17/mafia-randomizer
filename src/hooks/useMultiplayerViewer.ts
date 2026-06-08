import { useMemo } from "react";

import { useMeQuery } from "../store/api/authApi";
import { useAppSelector } from "./useAppSelector";
import { ROLES, type RoleKey } from "../utils/roleAssets";
import {
  selectGame,
  type GameSeat,
  type GameState,
  type NightActionType,
  type Nomination,
  type PlayerRole,
  type Vote,
} from "../store/multiplayerSlice";

const NIGHT_ACTION_BY_ROLE: Record<PlayerRole, NightActionType | null> = {
  INNOCENT: null,
  MAFIA: "MAFIA_KILL_VOTE",
  DON: "MAFIA_KILL_VOTE",
  SHERIFF: "SHERIFF_CHECK",
  DOCTOR: "DOCTOR_PROTECT",
  PUTANA: "ROLEBLOCK",
};

const ROLE_KEY_BY_PLAYER_ROLE: Record<PlayerRole, RoleKey> = {
  INNOCENT: ROLES.INNOCENT,
  MAFIA: ROLES.MAFIA,
  DON: ROLES.DON,
  SHERIFF: ROLES.SHERIFF,
  DOCTOR: ROLES.DOCTOR,
  PUTANA: ROLES.PUTANA,
};

export const toRoleKey = (role: PlayerRole | null): RoleKey | null => (role ? ROLE_KEY_BY_PLAYER_ROLE[role] : null);

export interface MultiplayerViewer {
  game: GameState | null;
  meId: string | null;
  viewerSeat: GameSeat | null;
  viewerRole: PlayerRole | null;
  isHost: boolean;
  isAlive: boolean;
  nightActionType: NightActionType | null;
  nominatedSeats: Set<number>;
  nominationByTarget: Map<number, number>;
  myNomination: Nomination | null;
  myVote: Vote | null;
}

/**
 * Derives everything a player/host needs from the redux game state + the
 * authenticated user. Components call this directly instead of receiving the
 * derived flags as props.
 */
export function useMultiplayerViewer(): MultiplayerViewer {
  const { data: me } = useMeQuery();
  const game = useAppSelector(selectGame);
  const meId = me?.id ?? null;

  return useMemo(() => {
    const viewerSeat = meId && game ? (game.seats.find((s) => s.userId === meId) ?? null) : null;
    const viewerRole = viewerSeat?.role ?? null;
    const isHost = !!meId && !!game && meId === game.hostId;
    const isAlive = viewerSeat?.lifeStatus === "ALIVE";
    const nightActionType = viewerRole ? NIGHT_ACTION_BY_ROLE[viewerRole] : null;
    const nominatedSeats = new Set(game?.currentNominations.map((n) => n.targetSeat) ?? []);
    const nominationByTarget = new Map<number, number>(
      game?.currentNominations.map((n) => [n.targetSeat, n.actorSeat]) ?? []
    );
    const myNomination = viewerSeat
      ? (game?.currentNominations.find((n) => n.actorSeat === viewerSeat.seatNumber) ?? null)
      : null;
    const myVote = viewerSeat ? (game?.currentVotes.find((v) => v.actorSeat === viewerSeat.seatNumber) ?? null) : null;

    return {
      game,
      meId,
      viewerSeat,
      viewerRole,
      isHost,
      isAlive,
      nightActionType,
      nominatedSeats,
      nominationByTarget,
      myNomination,
      myVote,
    };
  }, [meId, game]);
}
