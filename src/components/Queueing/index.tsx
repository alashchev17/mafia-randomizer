import { AnimatePresence, motion } from "framer-motion";
import { FC } from "react";

import Title from "../Title";
import QueueingPlayer from "../QueueingPlayer";

import "./index.scss";

interface QueueingProps {
  queueingPlayers: number[];
  amountOfPlayers: number;
}

const Queueing: FC<QueueingProps> = ({ queueingPlayers, amountOfPlayers }) => {
  const queueingVariants = {
    visible: {
      height: "auto",
      y: 0,
      opacity: 1,
    },
    hidden: {
      height: 0,
      y: -40,
      opacity: 0,
    },
  };

  return (
    <motion.div
      className="queueing"
      variants={queueingVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: queueingPlayers.length,
        type: "spring",
      }}
      exit="hidden"
    >
      <Title text="Голосование" />
      <div className="queueing__players">
        <AnimatePresence mode="wait">
          {queueingPlayers.map((player) => (
            <QueueingPlayer
              key={player}
              player={player}
              queueingPlayers={queueingPlayers}
              amountOfPlayers={amountOfPlayers}
            />
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Queueing;
