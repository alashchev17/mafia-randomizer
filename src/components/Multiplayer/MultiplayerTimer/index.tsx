import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectTimer } from "../../../store/multiplayerSlice";
import { SocketEvents } from "../../../store/socket";

import "./index.scss";

interface Props {
  gameId: string;
  isHost: boolean;
}

const PRESETS = [60, 30, 20];

const MultiplayerTimer: FC<Props> = ({ gameId, isHost }) => {
  const { t } = useTranslation();
  const timer = useAppSelector(selectTimer);
  const [now, setNow] = useState(() => Date.now());

  const running = timer.state === "running" && timer.endsAt !== null;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [running, timer.endsAt]);

  const remainingMs = running ? Math.max(0, (timer.endsAt as number) - (now + timer.serverOffset)) : 0;
  const totalSec = Math.ceil(remainingMs / 1000);
  const mm = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");
  const expired = running && remainingMs === 0;

  return (
    <div className="mp-timer">
      <span
        className={`mp-timer__clock${expired ? " mp-timer__clock--done" : ""}${
          running ? "" : " mp-timer__clock--idle"
        }`}
      >
        {running ? `${mm}:${ss}` : "--:--"}
      </span>
      {isHost ? (
        <div className="mp-timer__controls">
          {PRESETS.map((s) => (
            <button
              key={s}
              type="button"
              className="button button--outline mp-timer__preset"
              onClick={() => SocketEvents.timerStart(gameId, s * 1000)}
            >
              {s}
              {t("multiplayer.game.timerSec")}
            </button>
          ))}
          <button
            type="button"
            className="button button--third mp-timer__preset"
            onClick={() => SocketEvents.timerSkip(gameId)}
            disabled={!running}
          >
            {t("multiplayer.game.timerSkip")}
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default MultiplayerTimer;
