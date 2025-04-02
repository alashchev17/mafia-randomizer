import React, { FC, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Penalty from "../Penalty";

import { IGameDeskPlayer } from "../../models";

import "./index.scss";

import mutedSvg from "./assets/mute.svg";
import killedSvg from "./assets/killed.svg";
import deletedSvg from "./assets/deleted.svg";
import queuedSvg from "./assets/queued.svg";

import killBtnSvg from "./assets/buttons/kill.svg";
import queueBtnSvg from "./assets/buttons/queue.svg";
import deleteBtnSvg from "./assets/buttons/delete.svg";
import { useSessionContext } from "../../contexts/SessionContext.tsx";
import { useTranslation } from "react-i18next";

interface GameDeskCardProps {
  player: IGameDeskPlayer;
  setPlayerDead: React.Dispatch<React.SetStateAction<number>>;
  handleNotification: (state: boolean, text: string) => void;
}

const GameDeskCard: FC<GameDeskCardProps> = ({ player, setPlayerDead, handleNotification }) => {
  const { t } = useTranslation();

  const { gameStats, setGameStats, setQueueingPlayers, queueingPlayers, isInstantQueue, setIsQueueing, isQueueing } =
    useSessionContext();

  const [playerStatus, setPlayerStatus] = useState({
    isMuted: false,
    isKilled: false,
    isDeleted: false,
    isQueued: false,
  });

  const [mutedTime, setMutedTime] = useState<number | undefined>(undefined);

  const [isPromoted, setIsPromoted] = useState(queueingPlayers.indexOf(player.id) !== -1);

  const playerStatusClassNames = `player__status ${
    playerStatus.isMuted || playerStatus.isKilled || playerStatus.isDeleted || playerStatus.isQueued ? "visible" : ""
  }`;

  const playerContextMenuClassNames = `player__context-menu ${
    playerStatus.isKilled || playerStatus.isDeleted || playerStatus.isQueued ? "" : "visible"
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
    setPlayerStatus((prev) => ({
      ...prev,
      isMuted: prev.isMuted ? false : prev.isMuted,
      isKilled: !prev.isKilled,
    }));
    setPlayerDead((prev) => prev - 1);
    setGameStats((prev) => {
      const updatedHistory = [
        ...prev.history,
        {
          playerId: player.id,
          playerCard: player.roleSrc,
          reason: t("reasons.killed"),
          timestamp: {
            type: gameStats.type,
            cycle: gameStats.counter,
          },
        },
      ];
      return {
        ...prev,
        type: prev.type,
        counter: prev.counter,
        history: updatedHistory,
      };
    });
  };

  const handleDelete = () => {
    setPlayerStatus((prev) => ({
      ...prev,
      isMuted: prev.isMuted ? false : prev.isMuted,
      isDeleted: !prev.isDeleted,
    }));
    setPlayerDead((prev) => prev - 1);
    setGameStats((prev) => {
      const updatedHistory = [
        ...prev.history,
        {
          playerId: player.id,
          playerCard: player.roleSrc,
          reason: t("reasons.deleted"),
          timestamp: {
            type: gameStats.type,
            cycle: gameStats.counter,
          },
        },
      ];
      return {
        ...prev,
        type: prev.type,
        counter: prev.counter,
        history: updatedHistory,
      };
    });
  };

  const handleQueue = useCallback(
    (playerId: number, isInstantQueue?: boolean) => {
      if (isInstantQueue) {
        // handle instant queue
        setPlayerStatus((prev) => {
          return {
            ...prev,
            isMuted: false,
            isQueued: isInstantQueue && playerId === player.id ? true : prev.isQueued,
          };
        });

        setIsPromoted(false);
        setQueueingPlayers([]);
        setIsQueueing(false);
        setPlayerDead((prev) => {
          return player.id === playerId ? prev - 1 : prev;
        });
        setGameStats((prev) => {
          const updatedHistory = [...prev.history];

          if (playerId === player.id) {
            updatedHistory.push({
              playerId: player.id,
              playerCard: player.roleSrc,
              reason: t("reasons.singleQueued"),
              timestamp: {
                type: gameStats.type,
                cycle: gameStats.counter,
              },
            });
          }
          return {
            ...prev,
            type: prev.type,
            counter: prev.counter,
            history: updatedHistory,
          };
        });
        return;
      }
      setPlayerStatus((prev) => ({
        ...prev,
        isMuted: prev.isMuted ? false : prev.isMuted,
        isQueued: !prev.isQueued,
      }));
      setPlayerDead((prev) => prev - 1);
      setGameStats((prev) => {
        const updatedHistory = [
          ...prev.history,
          {
            playerId: player.id,
            playerCard: player.roleSrc,
            reason: t("reasons.queued"),
            timestamp: {
              type: gameStats.type,
              cycle: gameStats.counter,
            },
          },
        ];
        return {
          ...prev,
          type: prev.type,
          counter: prev.counter,
          history: updatedHistory,
        };
      });
    },
    [
      gameStats.counter,
      gameStats.type,
      player.id,
      player.roleSrc,
      setGameStats,
      setIsQueueing,
      setPlayerDead,
      setPlayerStatus,
      setQueueingPlayers,
      t,
    ]
  );

  const setupOnQueue = () => {
    if (isQueueing) {
      return;
    }
    if (gameStats.type === "День") {
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
    if (gameStats.type === "Ночь") {
      setIsPromoted(false);
      setQueueingPlayers([]);
      if (typeof mutedTime === "number" && mutedTime + 2 === gameStats.counter) {
        setMutedTime(undefined);
        setPlayerStatus((prev) => ({
          ...prev,
          isMuted: false,
        }));
      }
    }
  }, [mutedTime, gameStats.type, gameStats.counter, setQueueingPlayers]);

  useEffect(() => {
    if (playerStatus.isMuted) {
      setMutedTime(gameStats.counter);
    }
    // eslint-disable-next-line
  }, [playerStatus.isMuted]);

  useEffect(() => {
    if (!isInstantQueue) return;

    handleNotification(true, t("notifications.singlePlayerQueued", { playerId: queueingPlayers[0] }));
    handleQueue(queueingPlayers[0], isInstantQueue);
  }, [isInstantQueue, queueingPlayers, handleNotification, handleQueue, t]);

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
            gameStats.type === "Ночь" ||
            playerStatus.isKilled ||
            playerStatus.isDeleted ||
            playerStatus.isQueued ||
            isQueueing
              ? "disabled"
              : ""
          }`}
          onClick={setupOnQueue}
        ></span>
        <div className="player__actions">
          <div className={playerContextMenuClassNames}>
            <button className="player__button player__button--primary" onClick={handleKill}>
              <img src={killBtnSvg} alt="Kill icon" />
              <span>{t("buttons.kill")}</span>
            </button>
            <button className="player__button player__button--secondary" onClick={() => handleQueue(player.id, false)}>
              <img src={queueBtnSvg} alt="Queue icon" />
              <span>{t("buttons.queue")}</span>
            </button>
            <button className="player__button player__button--third" onClick={handleDelete}>
              <img src={deleteBtnSvg} alt="Delete icon" />
              <span>{t("buttons.delete")}</span>
            </button>
          </div>
          <img className="player__image" src={player.roleSrc} alt={`Card: ${player.role}`} />
          <div className={playerStatusClassNames}>
            <AnimatePresence>
              {playerStatus.isMuted && <motion.img exit={{ opacity: 0 }} src={mutedSvg} alt="Mute status" />}
              {playerStatus.isKilled && <motion.img exit={{ opacity: 0 }} src={killedSvg} alt="Killed status" />}
              {playerStatus.isQueued && <motion.img exit={{ opacity: 0 }} src={queuedSvg} alt="Queued status" />}
              {playerStatus.isDeleted && <motion.img exit={{ opacity: 0 }} src={deletedSvg} alt="Queued status" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Penalty setPlayerStatus={setPlayerStatus} playerStatus={playerStatus} />
    </motion.div>
  );
};

export default GameDeskCard;
