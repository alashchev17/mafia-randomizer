import { FC, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Avatar from "../../components/Avatar";
import RoomCode from "../../components/Multiplayer/RoomCode";
import { useMultiplayerConnection } from "../../hooks/useMultiplayerConnection";
import { useActiveRoom } from "../../hooks/useActiveRoom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectActiveGameId, selectRoom } from "../../store/multiplayerSlice";
import { useGetRoomQuery } from "../../store/api/roomsApi";
import { useMeQuery } from "../../store/api/authApi";
import { SocketEvents } from "../../store/socket";
import { pushNotification } from "../../store/notificationSlice";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";

import "./index.scss";

const MultiplayerRoomPage: FC = () => {
  const { t } = useTranslation();
  const { roomId = "" } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  useMultiplayerConnection();
  useActiveRoom(roomId);

  const { data: me } = useMeQuery();
  const { data: roomFromQuery } = useGetRoomQuery(roomId, { skip: !roomId });
  const room = useAppSelector(selectRoom) ?? roomFromQuery ?? null;
  const activeGameId = useAppSelector(selectActiveGameId);

  useEffect(() => {
    document.title = t("titles.multiplayerRoom");
  }, [t]);

  useEffect(() => {
    if (activeGameId) navigate(`/multiplayer/game/${roomId}`, { replace: true });
  }, [activeGameId, roomId, navigate]);

  const isHost = me?.id === room?.hostId;
  const nonHostPlayers = useMemo(() => room?.players.filter((p) => !p.isHost) ?? [], [room]);
  const allReady = nonHostPlayers.length > 0 && nonHostPlayers.every((p) => p.isReady);
  const canStart = isHost && nonHostPlayers.length >= 4 && allReady;

  const onLeave = () => {
    SocketEvents.roomLeave(roomId);
    navigate("/multiplayer");
  };

  const onStart = () => {
    if (!canStart) return;
    SocketEvents.roomStart(roomId);
  };

  const onToggleReady = () => {
    if (!me || !room) return;
    const self = room.players.find((p) => p.userId === me.id);
    SocketEvents.roomReady(roomId, !(self?.isReady ?? false));
  };

  if (!room) {
    return (
      <div className="mp-room mp-room--centered">
        <p>{t("multiplayer.lobby.waiting")}</p>
      </div>
    );
  }

  const selfPlayer = me ? room.players.find((p) => p.userId === me.id) : null;

  return (
    <motion.section className="mp-room" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <header className="mp-room__header">
        <h1 className="mp-room__title">{t("multiplayer.lobby.title")}</h1>
        <RoomCode code={room.code} onCopied={() => dispatch(pushNotification(t("multiplayer.lobby.codeCopied")))} />
      </header>

      <section className="mp-room__players">
        <span className="mp-room__players-title">
          {t("multiplayer.lobby.players")} {nonHostPlayers.length} / {room.maxPlayers}
        </span>
        <ul className="mp-room__list">
          {room.players.map((p) => (
            <li key={p.userId} className="mp-room__item">
              <Avatar username={p.username} size="sm" />
              <span className="mp-room__name">{p.username}</span>
              {p.isHost ? (
                <span className="mp-room__badge">{t("multiplayer.lobby.hostBadge")}</span>
              ) : (
                <span className={`mp-room__ready${p.isReady ? " mp-room__ready--on" : ""}`}>
                  {p.isReady ? t("buttons.ready") : t("buttons.notReady")}
                </span>
              )}
            </li>
          ))}
        </ul>
      </section>

      <footer className="mp-room__actions">
        {isHost ? (
          <button
            type="button"
            className={`button button--primary${canStart ? "" : " disabled"}`}
            onClick={onStart}
            disabled={!canStart}
          >
            {t("buttons.startGameNow")}
          </button>
        ) : (
          <button type="button" className="button button--secondary" onClick={onToggleReady}>
            {selfPlayer?.isReady ? t("buttons.notReady") : t("buttons.ready")}
          </button>
        )}
        <button type="button" className="button button--outline" onClick={onLeave}>
          {t("multiplayer.lobby.leave")}
        </button>
        {!canStart && isHost ? (
          <p className="mp-room__hint">
            {nonHostPlayers.length < 4 ? t("multiplayer.lobby.minPlayers") : t("multiplayer.lobby.notAllReady")}
          </p>
        ) : null}
      </footer>
    </motion.section>
  );
};

export default MultiplayerRoomPage;
