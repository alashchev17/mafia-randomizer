import { FC, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { useAppSelector } from "../../../hooks/useAppSelector";
import { useMultiplayerViewer } from "../../../hooks/useMultiplayerViewer";
import { selectChat, type ChatChannel } from "../../../store/multiplayerSlice";
import { SocketEvents } from "../../../store/socket";

import "./index.scss";

interface Props {
  roomId: string;
}

const Chat: FC<Props> = ({ roomId }) => {
  const { t } = useTranslation();
  const messages = useAppSelector(selectChat);
  const { game, meId, viewerSeat, viewerRole, isAlive, isHost } = useMultiplayerViewer();
  const phase = game?.phase;
  const isMafia = viewerRole === "MAFIA" || viewerRole === "DON";
  const dead = !!viewerSeat && !isAlive;

  const channels = useMemo<ChatChannel[]>(() => {
    const list: ChatChannel[] = ["GENERAL"];
    // The host observes every channel; players see only their own.
    if (isHost || (isMafia && isAlive)) list.push("MAFIA");
    if (isHost || dead) list.push("DEAD");
    return list;
  }, [isMafia, isAlive, dead, isHost]);

  // Whether the viewer may post in a channel right now (mirrors the server).
  const canWrite = (ch: ChatChannel): boolean => {
    if (isHost) return true;
    if (ch === "GENERAL") return isAlive && (phase === "DAY" || phase === "VOTING");
    if (ch === "MAFIA") return isMafia && isAlive && phase === "NIGHT";
    return dead; // DEAD
  };

  const [active, setActive] = useState<ChatChannel>("GENERAL");
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (roomId) SocketEvents.chatHistory(roomId);
  }, [roomId]);

  // Keep the active tab valid as role/life changes (e.g. after being killed).
  useEffect(() => {
    if (!channels.includes(active)) setActive("GENERAL");
  }, [channels, active]);

  // Auto-switch to the channel that's live for the current phase (players only;
  // the host stays where they put themselves so they can keep observing).
  useEffect(() => {
    if (isHost || !phase) return;
    const next: ChatChannel = dead ? "DEAD" : phase === "NIGHT" && isMafia ? "MAFIA" : "GENERAL";
    setActive((cur) => (cur === next ? cur : next));
  }, [phase, isHost, dead, isMafia]);

  const writable = canWrite(active);
  const shown = messages.filter((m) => m.channel === active);

  useEffect(() => {
    if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [shown.length, active]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!writable) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    SocketEvents.chatSend(roomId, active, trimmed);
    setText("");
  };

  return (
    <div className="mp-chat">
      <div className="mp-chat__tabs">
        {channels.map((ch) => (
          <button
            key={ch}
            type="button"
            className={`mp-chat__tab${active === ch ? " mp-chat__tab--active" : ""}`}
            onClick={() => setActive(ch)}
          >
            {t(`multiplayer.chat.channel.${ch}`)}
          </button>
        ))}
      </div>

      <div className="mp-chat__list" ref={listRef}>
        {shown.length === 0 ? (
          <p className="mp-chat__empty">{t("multiplayer.chat.empty")}</p>
        ) : (
          shown.map((m) => (
            <div key={m.id} className={`mp-chat__msg${m.userId === meId ? " mp-chat__msg--own" : ""}`}>
              <span className="mp-chat__author">{m.username}</span>
              <span className="mp-chat__text">{m.text}</span>
            </div>
          ))
        )}
      </div>

      <form className="mp-chat__form" onSubmit={submit}>
        <input
          className="mp-chat__input"
          value={text}
          maxLength={500}
          disabled={!writable}
          onChange={(e) => setText(e.target.value)}
          placeholder={writable ? t("multiplayer.chat.placeholder") : t("multiplayer.chat.closed")}
        />
        <button type="submit" className="button button--primary mp-chat__send" disabled={!writable}>
          {t("multiplayer.chat.send")}
        </button>
      </form>
    </div>
  );
};

export default Chat;
