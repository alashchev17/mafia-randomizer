import React, { FC } from "react";

import GameDeskCard from "../GameDeskCard";

import "./index.scss";

import { IPlayers, IGameDeskPlayers, IGameStats } from "../../models";
import { motion } from "framer-motion";

interface GameDeskProps {
  players: IPlayers[];
  queueingPlayers: number[];
  gameStats: IGameStats;
  isQueueing: boolean;
  isInstantQueue: boolean;
  setIsQueueing: React.Dispatch<React.SetStateAction<boolean>>;
  setGameStats: React.Dispatch<React.SetStateAction<IGameStats>>;
  setQueueingPlayers: React.Dispatch<React.SetStateAction<number[]>>;
  setInnocentPlayersAlive: React.Dispatch<React.SetStateAction<number>>;
  setMafiaPlayersAlive: React.Dispatch<React.SetStateAction<number>>;
  handleNotification: (state: boolean, text: string) => void;
}

const GameDesk: FC<GameDeskProps> = ({
  players,
  queueingPlayers,
  isInstantQueue,
  gameStats,
  isQueueing,
  setIsQueueing,
  setGameStats,
  setQueueingPlayers,
  setInnocentPlayersAlive,
  setMafiaPlayersAlive,
  handleNotification,
}) => {
  const listOfPlayers: IGameDeskPlayers[] = players.map(
    (player: IPlayers, index: number) => {
      return {
        id: index + 1,
        role: player.role,
        roleSrc: player.roleSrc,
        isMafia: player.role === "Мафия" || player.role === "Дон",
      };
    },
  );

  const gameDeskVariants = {
    visible: {
      y: 0,
      opacity: 1,
    },
    hidden: {
      y: -40,
      opacity: 0,
    },
  };
  return (
    <motion.div
      className="game-desk"
      variants={gameDeskVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.7,
      }}
      exit="hidden"
    >
      <div className={`game-desk__cards game-desk__cards--${players.length}`}>
        {listOfPlayers.map((player) => (
          <GameDeskCard
            key={player.id}
            player={player}
            queueingPlayers={queueingPlayers}
            isInstantQueue={isInstantQueue}
            setPlayerDead={
              player.isMafia ? setMafiaPlayersAlive : setInnocentPlayersAlive
            }
            isQueueing={isQueueing}
            setIsQueueing={setIsQueueing}
            setQueueingPlayers={setQueueingPlayers}
            gameStats={gameStats}
            setGameStats={setGameStats}
            handleNotification={handleNotification}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default GameDesk;
