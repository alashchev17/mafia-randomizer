import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectLog, type LogEntry } from "../../../store/multiplayerSlice";
import { capitalize } from "../../../utils/format";
import { checkVerdict } from "../../../utils/checkVerdict";

import "./index.scss";

const formatEntry = (t: TFunction, entry: LogEntry): string => {
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
      return t("multiplayer.log.gameFinished", {
        winnerLabel: payload.winner ? t(`multiplayer.team.${String(payload.winner)}`) : t("multiplayer.log.noWinner"),
      });
    default:
      return entry.type;
  }
};

const GameLog: FC = () => {
  const { t } = useTranslation();
  const log = useAppSelector(selectLog);
  const listRef = useRef<HTMLUListElement>(null);
  const pinnedRef = useRef(true);

  const handleScroll = () => {
    const el = listRef.current;
    if (!el) return;
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
  };

  useEffect(() => {
    const el = listRef.current;
    if (el && pinnedRef.current) el.scrollTop = el.scrollHeight;
  }, [log]);

  return (
    <section className="mp-log">
      <span className="mp-log__title">{t("multiplayer.game.logTitle")}</span>
      {log.length === 0 ? (
        <p className="mp-log__empty">{t("multiplayer.game.logEmpty")}</p>
      ) : (
        <ul ref={listRef} className="mp-log__list" onScroll={handleScroll}>
          {log.map((entry) =>
            entry.type === "PHASE_CHANGE" ? (
              <li key={entry.id} className="mp-log__phase">
                <span className="mp-log__phase-line" />
                <span className="mp-log__phase-label">{formatEntry(t, entry)}</span>
                <span className="mp-log__phase-line" />
              </li>
            ) : (
              <li key={entry.id} className="mp-log__item">
                <span className="mp-log__cycle">{entry.cycle + 1}</span>
                <span className="mp-log__text">{formatEntry(t, entry)}</span>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
};

export default GameLog;
