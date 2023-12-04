import { motion } from "framer-motion";
import { FC } from "react";
import Title from "../Title";
import QueueingPlayer from "../QueueingPlayer";

interface QueueingProps {
  queueingPlayers: number[];
}

const Queueing: FC<QueueingProps> = ({ queueingPlayers }) => {
  const queueingVariants = {
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
      className="queueing"
      variants={queueingVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
    >
      <Title text="Голосование" />
      <div className="queueing__players">
        {queueingPlayers.map((player) => (
          <QueueingPlayer key={player} player={player} />
        ))}
      </div>
    </motion.div>
  );
};

export default Queueing;
