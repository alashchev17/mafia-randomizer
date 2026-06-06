import { FC } from "react";
import { useTranslation } from "react-i18next";

import MultiplayerCard from "../MultiplayerCard";
import MultiplayerTimer from "../MultiplayerTimer";
import { useMultiplayerViewer } from "../../../hooks/useMultiplayerViewer";

import "./index.scss";

const MultiplayerDesk: FC = () => {
  const { t } = useTranslation();
  const { game, viewerSeat, isAlive, isHost, nightActionType } = useMultiplayerViewer();

  if (!game) return null;

  const nightBannerKey = () => {
    if (game.cycle === 0) return "multiplayer.game.bannerNightFirst";
    return nightActionType ? "multiplayer.game.bannerNightAct" : "multiplayer.game.bannerNight";
  };

  let banner = "";
  if (isHost) {
    // Host gets no phase banner; the guard keeps them out of the branches below.
  } else if (viewerSeat && !isAlive) {
    banner = t("multiplayer.game.bannerDead");
  } else if (game.phase === "NIGHT") {
    banner = t(nightBannerKey());
  } else if (game.phase === "DAY") {
    banner = t("multiplayer.game.bannerDay");
  } else if (game.phase === "VOTING") {
    banner = t("multiplayer.game.bannerVoting");
  }

  return (
    <div className="mp-desk">
      <MultiplayerTimer gameId={game.id} isHost={isHost} />
      {banner ? <p className="mp-desk__banner">{banner}</p> : null}
      <div className="mp-desk__grid">
        {game.seats.map((s) => (
          <MultiplayerCard key={s.userId} seatNumber={s.seatNumber} />
        ))}
      </div>
    </div>
  );
};

export default MultiplayerDesk;
