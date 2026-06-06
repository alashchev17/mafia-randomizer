import { FC } from "react";
import { useTranslation } from "react-i18next";

import type { GameSeat, PlayerTeam } from "../../../store/multiplayerSlice";

import "./index.scss";

interface Props {
  viewerSeat: GameSeat | null;
  isHost: boolean;
}

const teamModifier = (team: PlayerTeam | null): string =>
  team === "MAFIA" ? "role-banner--mafia" : team === "CITIZENS" ? "role-banner--citizens" : "role-banner--neutral";

const RoleBanner: FC<Props> = ({ viewerSeat, isHost }) => {
  const { t } = useTranslation();

  if (isHost) {
    return (
      <div className="role-banner role-banner--host">
        <span className="role-banner__role">{t("multiplayer.game.youAreHost")}</span>
      </div>
    );
  }

  if (!viewerSeat) return null;

  return (
    <div className={`role-banner ${teamModifier(viewerSeat.team)}`}>
      <div className="role-banner__main">
        <span className="role-banner__label">{t("multiplayer.game.yourRole")}</span>
        <span className="role-banner__role">{viewerSeat.role ? t(`multiplayer.role.${viewerSeat.role}`) : "—"}</span>
      </div>
      <span className="role-banner__seat">
        {t("multiplayer.game.seat")} #{viewerSeat.seatNumber}
      </span>
    </div>
  );
};

export default RoleBanner;
