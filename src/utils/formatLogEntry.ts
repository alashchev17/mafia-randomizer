import type { TFunction } from "i18next";

import type { LogEntry } from "../store/multiplayerSlice";
import { capitalize } from "./format";
import { checkVerdict } from "./checkVerdict";

/**
 * Render a single game-log event into a localized, human-readable line.
 * Shared by the live in-game log (Multiplayer/GameLog) and the persisted
 * game-detail recap (GameDetailPage), so both stay in sync.
 */
export const formatLogEntry = (t: TFunction, entry: LogEntry): string => {
  const payload = (entry.payload ?? {}) as Record<string, unknown>;

  switch (entry.type) {
    case "GAME_STARTED":
      return t("multiplayer.log.gameStarted");
    case "PHASE_CHANGE":
      return t("multiplayer.log.phaseChange", {
        phaseLabel: t(`multiplayer.game.phase${capitalize(String(payload.phase))}`),
      });
    case "PLAYER_NOMINATION":
      return t("multiplayer.log.playerNomination", payload);
    case "HOST_NOMINATION":
      return t("multiplayer.log.hostNomination", payload);
    case "VOTE_REMOVAL":
      return t("multiplayer.log.voteRemoval", payload);
    case "HOST_VOTE_RESULT":
      return t("multiplayer.log.hostVoteResult", payload);
    case "HOST_NO_REMOVAL":
      return t("multiplayer.log.hostNoRemoval");
    case "TIE_NO_REMOVAL":
      return t("multiplayer.log.tieNoRemoval");
    case "MAFIA_KILL":
      return t("multiplayer.log.mafiaKill", payload);
    case "HOST_NIGHT_KILL":
      return t("multiplayer.log.hostNightKill", payload);
    case "HOST_NO_NIGHT_KILL":
      return t("multiplayer.log.hostNoNightKill");
    case "MAFIA_NO_KILL_TIE":
      return t("multiplayer.log.mafiaNoKillTie");
    case "DOCTOR_SAVED":
      return t("multiplayer.log.doctorSaved");
    case "ROLEBLOCKED":
      return t("multiplayer.log.roleblocked", payload);
    case "CHECK_RESULT": {
      const { key } = checkVerdict({
        isMafia: payload.isMafia as boolean | undefined,
        isSheriff: payload.isSheriff as boolean | undefined,
      });
      return t("multiplayer.log.checkResult", { ...payload, verdict: t(`multiplayer.log.${key}`) });
    }
    case "PENALTY":
      return t("multiplayer.log.penalty", payload);
    case "BANNED":
      return t("multiplayer.log.banned", payload);
    case "GAME_FINISHED":
      return t("multiplayer.log.gameFinished");
    default:
      return entry.type;
  }
};
