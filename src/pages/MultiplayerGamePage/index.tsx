import { FC, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import RoleBanner from "../../components/Multiplayer/RoleBanner";
import HostControls from "../../components/Multiplayer/HostControls";
import MultiplayerDesk from "../../components/Multiplayer/MultiplayerDesk";
import GameLog from "../../components/Multiplayer/GameLog";
import CheckResults from "../../components/Multiplayer/CheckResults";
import { selectLastFinish, selectPrivateChecks, selectRoom } from "../../store/multiplayerSlice";
import { useGetRoomQuery } from "../../store/api/roomsApi";
import { useGetGameQuery } from "../../store/api/gamesApi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useMultiplayerConnection } from "../../hooks/useMultiplayerConnection";
import { useActiveRoom } from "../../hooks/useActiveRoom";
import { useMultiplayerViewer } from "../../hooks/useMultiplayerViewer";
import { SocketEvents } from "../../store/socket";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";
import { capitalize, formatRatingDelta } from "../../utils/format";

import "./index.scss";

const MultiplayerGamePage: FC = () => {
  const { t } = useTranslation();
  const { roomId = "" } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  useMultiplayerConnection();
  useActiveRoom(roomId);

  const { data: room } = useGetRoomQuery(roomId, { skip: !roomId });
  const stateRoom = useAppSelector(selectRoom);
  const lastFinish = useAppSelector(selectLastFinish);
  const checks = useAppSelector(selectPrivateChecks);

  const { game, meId, viewerSeat, viewerRole, isHost, nominatedSeats } = useMultiplayerViewer();

  const effectiveGameId = game?.id ?? room?.gameId ?? stateRoom?.gameId ?? null;
  useGetGameQuery(effectiveGameId ?? "", { skip: !effectiveGameId });

  useEffect(() => {
    document.title = t("titles.multiplayerGame");
  }, [t]);

  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!lastFinish) return;
    finishTimer.current = setTimeout(() => navigate("/profile", { replace: true }), 3500);
    return () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, [lastFinish, navigate]);

  if (!game) {
    return (
      <div className="mp-game mp-game--centered">
        <p>{t("multiplayer.lobby.waiting")}</p>
      </div>
    );
  }

  const myDelta = meId ? lastFinish?.ratingDeltas.find((d) => d.userId === meId) : undefined;
  const showChecks = viewerRole === "SHERIFF";

  return (
    <motion.section className="mp-game" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <header className="mp-game__header">
        <div className="mp-game__phase">
          <span className="mp-game__phase-label">{t(`multiplayer.game.phase${capitalize(game.phase)}`)}</span>
          <span className="mp-game__phase-cycle">— {game.cycle + 1}</span>
        </div>
        <RoleBanner viewerSeat={viewerSeat} isHost={isHost} />
      </header>

      {lastFinish ? (
        <div className="mp-game__finish">
          <h2 className="mp-game__finish-title">
            {lastFinish.winner === "CITIZENS"
              ? t("multiplayer.game.winnerCitizens")
              : lastFinish.winner === "MAFIA"
                ? t("multiplayer.game.winnerMafia")
                : t("multiplayer.game.hostTerminated")}
          </h2>
          {myDelta ? (
            <p>
              {t("multiplayer.game.ratingDelta", {
                delta: formatRatingDelta(myDelta.delta),
              })}
            </p>
          ) : null}
        </div>
      ) : null}

      {showChecks ? <CheckResults results={checks} currentCycle={game.cycle} /> : null}

      <MultiplayerDesk />

      {viewerSeat && game.phase === "VOTING" && nominatedSeats.size > 0 ? (
        <button type="button" className="button button--third" onClick={() => SocketEvents.vote(game.id, null)}>
          {t("multiplayer.game.passVote")}
        </button>
      ) : null}

      {isHost ? (
        <>
          <HostControls
            onAdvance={() => SocketEvents.advancePhase(game.id)}
            onFinish={() => SocketEvents.hostFinish(game.id)}
          />
          <GameLog />
        </>
      ) : null}
    </motion.section>
  );
};

export default MultiplayerGamePage;
