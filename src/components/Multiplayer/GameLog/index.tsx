import { FC, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectLog } from "../../../store/multiplayerSlice";
import { formatLogEntry } from "../../../utils/formatLogEntry";

import "./index.scss";

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
                <span className="mp-log__phase-label">{formatLogEntry(t, entry)}</span>
                <span className="mp-log__phase-line" />
              </li>
            ) : (
              <li key={entry.id} className="mp-log__item">
                <span className="mp-log__cycle">{entry.cycle + 1}</span>
                <span className="mp-log__text">{formatLogEntry(t, entry)}</span>
              </li>
            )
          )}
        </ul>
      )}
    </section>
  );
};

export default GameLog;
