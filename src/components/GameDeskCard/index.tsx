import React, { FC, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Penalty from "../Penalty";

import { IGameDeskPlayers } from "../../models";

import "./index.scss";

import mutedSvg from "./assets/mute.svg";
import killedSvg from "./assets/killed.svg";
import deletedSvg from "./assets/deleted.svg";
import queuedSvg from "./assets/queued.svg";

import killBtnSvg from "./assets/buttons/kill.svg";
import queueBtnSvg from "./assets/buttons/queue.svg";
import deleteBtnSvg from "./assets/buttons/delete.svg";

interface GameDeskCardProps {
  player: IGameDeskPlayers;
  queueingPlayers: number[];
  gameTime: string;
  setQueueingPlayers: React.Dispatch<React.SetStateAction<number[]>>;
}

const GameDeskCard: FC<GameDeskCardProps> = ({
  player,
  queueingPlayers,
  gameTime,
  setQueueingPlayers,
}) => {
  const [playerStatus, setPlayerStatus] = useState({
    isMuted: false,
    isKilled: false,
    isDeleted: false,
    isQueued: false,
  });

  const [isPromoted, setIsPromoted] = useState(
    queueingPlayers.indexOf(player.id) !== -1,
  );

  const playerStatusClassNames = `player__status ${
    playerStatus.isMuted ||
    playerStatus.isKilled ||
    playerStatus.isDeleted ||
    playerStatus.isQueued
      ? "visible"
      : ""
  }`;

  const playerContextMenuClassNames = `player__context-menu ${
    playerStatus.isKilled || playerStatus.isDeleted || playerStatus.isQueued
      ? ""
      : "visible"
  }`;

  const playerCardVariants = {
    hidden: {
      opacity: 0,
      y: -40,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.3 + index * 0.15,
        duration: 1.5,
        type: "spring",
      },
    }),
  };

  const handleKill = () => {
    setPlayerStatus({
      isDeleted: false,
      isKilled: true,
      isQueued: false,
      isMuted: false,
    });
  };

  const handleDelete = () => {
    setPlayerStatus({
      isDeleted: true,
      isKilled: false,
      isQueued: false,
      isMuted: false,
    });
  };

  const handleQueue = () => {
    setPlayerStatus({
      isDeleted: false,
      isKilled: false,
      isQueued: true,
      isMuted: false,
    });
  };

  const setupOnQueue = () => {
    if (gameTime === "День") {
      if (!isPromoted) {
        setIsPromoted((prev) => !prev);
        setQueueingPlayers((prev) => {
          return [...prev, player.id];
        });
      } else {
        setIsPromoted((prev) => !prev);
        setQueueingPlayers((prev) => {
          const currentArray = [...prev];
          const indexInArray = currentArray.indexOf(player.id);
          currentArray.splice(indexInArray, 1);
          return currentArray;
        });
      }
    }
  };

  useEffect(() => {
    if (gameTime === "Ночь") {
      setIsPromoted(false);
      setQueueingPlayers([]);
    }
  }, [gameTime, setQueueingPlayers]);

  return (
    <motion.div
      className="player game-desk__player"
      variants={playerCardVariants}
      initial="hidden"
      animate="visible"
      custom={player.id}
    >
      <h3 className="player__title">№{player.id}</h3>
      <div className="player__card">
        <span
          className={`player__queue ${isPromoted ? "pressed" : ""} ${
            gameTime === "Ночь" ||
            playerStatus.isKilled ||
            playerStatus.isDeleted ||
            playerStatus.isQueued
              ? "disabled"
              : ""
          }`}
          onClick={setupOnQueue}
        ></span>
        <div className="player__actions">
          <div className={playerContextMenuClassNames}>
            <button
              className="player__button player__button--primary"
              onClick={handleKill}
            >
              <img src={killBtnSvg} alt="Kill icon" />
              <span>Отстрел</span>
            </button>
            <button
              className="player__button player__button--secondary"
              onClick={handleQueue}
            >
              <img src={queueBtnSvg} alt="Queue icon" />
              <span>Снятие</span>
            </button>
            <button
              className="player__button player__button--third"
              onClick={handleDelete}
            >
              <img src={deleteBtnSvg} alt="Delete icon" />
              <span>Удаление</span>
            </button>
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
      </div>
      <Penalty setPlayerStatus={setPlayerStatus} playerStatus={playerStatus} />
    </motion.div>
  );
};

export default GameDeskCard;
