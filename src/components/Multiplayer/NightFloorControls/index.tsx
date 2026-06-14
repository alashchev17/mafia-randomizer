import { FC } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { selectGame, selectNightFloor, type NightActionType } from "../../../store/multiplayerSlice";
import { SocketEvents } from "../../../store/socket";

import "./index.scss";

const NIGHT_FLOOR_DURATION_MS = 20_000;

// Ordered night turns the host calls. `roles` are the seat roles that belong to
// the group (host sees real roles, so presence is derived from the seats).
const NIGHT_GROUPS: { type: NightActionType; labelKey: string; roles: string[] }[] = [
  { type: "MAFIA_KILL_VOTE", labelKey: "multiplayer.game.nightFloorMafia", roles: ["MAFIA", "DON"] },
  { type: "SHERIFF_CHECK", labelKey: "multiplayer.game.nightFloorSheriff", roles: ["SHERIFF"] },
  { type: "DOCTOR_PROTECT", labelKey: "multiplayer.game.nightFloorDoctor", roles: ["DOCTOR"] },
  { type: "ROLEBLOCK", labelKey: "multiplayer.game.nightFloorPutana", roles: ["PUTANA"] },
];

const NightFloorControls: FC = () => {
  const { t } = useTranslation();
  const game = useAppSelector(selectGame);
  const nightFloor = useAppSelector(selectNightFloor);

  if (!game) return null;

  // Only groups that still have a living member are worth calling.
  const groups = NIGHT_GROUPS.filter((g) =>
    game.seats.some((s) => s.role !== null && g.roles.includes(s.role) && s.lifeStatus === "ALIVE")
  );
  if (groups.length === 0) return null;

  return (
    <div className="night-floor">
      <h3 className="night-floor__title">{t("multiplayer.game.nightFloorTitle")}</h3>
      <div className="night-floor__buttons">
        {groups.map((g) => (
          <button
            key={g.type}
            type="button"
            className={`button ${nightFloor === g.type ? "button--primary" : "button--secondary"}`}
            onClick={() => SocketEvents.nightFloor(game.id, g.type, NIGHT_FLOOR_DURATION_MS)}
          >
            {t(g.labelKey)}
          </button>
        ))}
        <button
          type="button"
          className="button button--third"
          onClick={() => SocketEvents.nightFloor(game.id, null)}
          disabled={nightFloor === null}
        >
          {t("multiplayer.game.nightFloorClear")}
        </button>
      </div>
    </div>
  );
};

export default NightFloorControls;
