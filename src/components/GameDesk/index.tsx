import React, { FC } from "react";

import GameDeskCard from "../GameDeskCard";

import "./index.scss";

import { IPlayers, IGameDeskPlayers } from "../../models";
import { motion } from "framer-motion";

interface GameDeskProps {
  players: IPlayers[];
  queueingPlayers: number[];
  gameTime: string;
  setQueueingPlayers: React.Dispatch<React.SetStateAction<number[]>>;
}

const GameDesk: FC<GameDeskProps> = ({
  players,
  queueingPlayers,
  gameTime,
  setQueueingPlayers,
}) => {
  const listOfPlayers: IGameDeskPlayers[] = players.map(
    (player: IPlayers, index: number) => {
      return {
        id: index + 1,
        role: player.role,
        roleSrc: player.roleSrc,
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
            setQueueingPlayers={setQueueingPlayers}
            gameTime={gameTime}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default GameDesk;
