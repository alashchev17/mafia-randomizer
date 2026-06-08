import { FC, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import RoleBanner from "../../components/Multiplayer/RoleBanner";
import HostControls from "../../components/Multiplayer/HostControls";
import MultiplayerDesk from "../../components/Multiplayer/MultiplayerDesk";
import GameLog from "../../components/Multiplayer/GameLog";
import Chat from "../../components/Multiplayer/Chat";
import CheckResults from "../../components/Multiplayer/CheckResults";
import CenteredMessage from "../../components/CenteredMessage";
import {
  selectLastFinish,
  selectNightChoices,
  selectPrivateChecks,
  selectRoom,
  selectSocketStatus,
} from "../../store/multiplayerSlice";
import { useGetRoomQuery } from "../../store/api/roomsApi";
import { useGetGameQuery } from "../../store/api/gamesApi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useMultiplayerConnection } from "../../hooks/useMultiplayerConnection";
import { useActiveRoom } from "../../hooks/useActiveRoom";
import { useMultiplayerViewer } from "../../hooks/useMultiplayerViewer";
import { SocketEvents, reconnectSocket } from "../../store/socket";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";
import { capitalize, formatRatingDelta } from "../../utils/format";
import type { GameWinner, NightActionType } from "../../store/multiplayerSlice";

import "./index.scss";

const WINNER_TITLE_KEY: Record<GameWinner, string> = {
  CITIZENS: "multiplayer.game.winnerCitizens",
  MAFIA: "multiplayer.game.winnerMafia",
};

const winnerTitleKey = (winner: GameWinner | null): string =>
  winner ? WINNER_TITLE_KEY[winner] : "multiplayer.game.hostTerminated";

const NIGHT_ACTION_KEY: Record<NightActionType, string> = {
  MAFIA_KILL_VOTE: "multiplayer.game.actionKill",
  SHERIFF_CHECK: "multiplayer.game.actionCheck",
  DON_CHECK_SHERIFF: "multiplayer.game.actionCheck",
  DOCTOR_PROTECT: "multiplayer.game.actionProtect",
  ROLEBLOCK: "multiplayer.game.actionRoleblock",
};

// How long the finish screen stays up before returning everyone to the lobby
// (the room stays open so the host can start a rematch with the same players).
const FINISH_REDIRECT_MS = 6000;

const MultiplayerGamePage: FC = () => {
  const { t } = useTranslation();
  const { roomId = "" } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useMultiplayerConnection();
  useActiveRoom(roomId);
  const socketStatus = useAppSelector(selectSocketStatus);

  const { data: room } = useGetRoomQuery(roomId, { skip: !roomId });
  const stateRoom = useAppSelector(selectRoom);
  const lastFinish = useAppSelector(selectLastFinish);
  const checks = useAppSelector(selectPrivateChecks);
  const nightChoices = useAppSelector(selectNightChoices);

  const { game, meId, viewerSeat, viewerRole, isHost, nominatedSeats } = useMultiplayerViewer();

  const effectiveGameId = game?.id ?? room?.gameId ?? stateRoom?.gameId ?? null;
  useGetGameQuery(effectiveGameId ?? "", { skip: !effectiveGameId });

  useEffect(() => {
    document.title = t("titles.multiplayerGame");
  }, [t]);

  const lobbyPath = `/multiplayer/room/${roomId}`;
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!lastFinish) return;
    finishTimer.current = setTimeout(() => navigate(lobbyPath, { replace: true }), FINISH_REDIRECT_MS);
    return () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
    };
  }, [lastFinish, navigate, lobbyPath]);

  if (!game) {
    return (
      <CenteredMessage base="mp-game">
        <p>{t("multiplayer.lobby.waiting")}</p>
      </CenteredMessage>
    );
  }

  const myDelta = meId ? lastFinish?.ratingDeltas.find((d) => d.userId === meId) : undefined;
  const showChecks = viewerRole === "SHERIFF";

  return (
    <motion.section
      className={`mp-game${isHost ? " mp-game--host" : ""}`}
      initial={pagesInitial}
      animate={pagesAnimate}
      transition={pagesTransition}
    >
      <header className="mp-game__header">
        <div className="mp-game__phase">
          <span className="mp-game__phase-label">{t(`multiplayer.game.phase${capitalize(game.phase)}`)}</span>
          <span className="mp-game__phase-cycle">— {game.cycle + 1}</span>
        </div>
        <RoleBanner viewerSeat={viewerSeat} isHost={isHost} />
      </header>

      {socketStatus !== "connected" ? (
        <div className="mp-game__reconnect" role="status">
          <span>{t("multiplayer.game.disconnected")}</span>
          <button type="button" className="button button--third" onClick={() => reconnectSocket(dispatch)}>
            {t("multiplayer.game.reconnect")}
          </button>
        </div>
      ) : null}

      {lastFinish ? (
        <div className="mp-game__finish">
          <h2 className="mp-game__finish-title">{t(winnerTitleKey(lastFinish.winner))}</h2>
          {myDelta ? (
            <p>
              {t("multiplayer.game.ratingDelta", {
                delta: formatRatingDelta(myDelta.delta),
              })}
            </p>
          ) : null}
          <button
            type="button"
            className="button button--primary"
            onClick={() => navigate(lobbyPath, { replace: true })}
          >
            {t(isHost ? "multiplayer.game.playAgain" : "multiplayer.game.backToLobby")}
          </button>
        </div>
      ) : null}

      <div className="mp-game__body">
        <div className="mp-game__main">
          {showChecks ? <CheckResults results={checks} currentCycle={game.cycle} /> : null}
          <MultiplayerDesk />
        </div>

        <aside className="mp-game__side">
          {isHost && game.phase === "NIGHT" ? (
            <div className="mp-game__night-choices">
              <h3>{t("multiplayer.game.nightChoicesTitle")}</h3>
              {nightChoices.length === 0 ? (
                <p className="mp-game__night-choices-empty">{t("multiplayer.game.nightChoicesEmpty")}</p>
              ) : (
                <ul>
                  {nightChoices.map((c) => (
                    <li key={`${c.actorSeat}-${c.type}`}>
                      #{c.actorSeat} → #{c.targetSeat} <span>{t(NIGHT_ACTION_KEY[c.type])}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : null}
          <Chat roomId={roomId} />
          {isHost ? <GameLog /> : null}
        </aside>
      </div>

      <footer className="mp-game__controls">
        {viewerSeat && game.phase === "VOTING" && nominatedSeats.size > 0 ? (
          <button type="button" className="button button--third" onClick={() => SocketEvents.vote(game.id, null)}>
            {t("multiplayer.game.passVote")}
          </button>
        ) : null}
        {isHost ? (
          <HostControls
            onAdvance={() => SocketEvents.advancePhase(game.id)}
            onFinish={() => SocketEvents.hostFinish(game.id)}
          />
        ) : null}
      </footer>
    </motion.section>
  );
};

export default MultiplayerGamePage;
