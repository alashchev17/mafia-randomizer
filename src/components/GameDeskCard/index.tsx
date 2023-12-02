import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Penalty from "../Penalty";

import { IGameDeskPlayers } from "../../models";

import "./index.scss";

import mutedSvg from "./assets/mute.svg";
import killedSvg from "./assets/killed.svg";
import deletedSvg from "./assets/deleted.svg";
import queuedSvg from "./assets/queued.svg";

interface GameDeskCardProps {
  player: IGameDeskPlayers;
}

const GameDeskCard: FC<GameDeskCardProps> = ({ player }) => {
  const [playerStatus, setPlayerStatus] = useState({
    isMuted: false,
    isKilled: false,
    isDeleted: false,
    isQueued: false,
  });

  const playerStatusClassNames = `player__status ${
    playerStatus.isMuted ||
    playerStatus.isKilled ||
    playerStatus.isDeleted ||
    playerStatus.isQueued
      ? "visible"
      : ""
  }`;

  return (
    <div className="player game-desk__player">
      <h3 className="player__title">№{player.id}</h3>
      <div className="player__actions">
        <div className="player__context-menu">
          {/*  todo: реализовать контекстное меню */}
        </div>
        <img
          className="player__image"
          src={player.roleSrc}
          alt={`Card: ${player.role}`}
        />
        <div className={playerStatusClassNames}>
          <AnimatePresence>
            {playerStatus.isMuted && (
              <motion.img
                exit={{ opacity: 0 }}
                src={mutedSvg}
                alt="Mute status"
              />
            )}
            {playerStatus.isKilled && (
              <motion.img
                exit={{ opacity: 0 }}
                src={killedSvg}
                alt="Killed status"
              />
            )}
            {playerStatus.isQueued && (
              <motion.img
                exit={{ opacity: 0 }}
                src={queuedSvg}
                alt="Queued status"
              />
            )}
            {playerStatus.isDeleted && (
              <motion.img
                exit={{ opacity: 0 }}
                src={deletedSvg}
                alt="Queued status"
              />
            )}
          </AnimatePresence>
        </div>
      </div>
      <Penalty setPlayerStatus={setPlayerStatus} playerStatus={playerStatus} />
    </div>
  );
};

export default GameDeskCard;
