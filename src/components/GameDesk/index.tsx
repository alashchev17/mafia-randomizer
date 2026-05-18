import { FC } from "react";
import { motion } from "framer-motion";

import GameDeskCard from "../GameDeskCard";

import "./index.scss";

import { useAppSelector } from "../../hooks/useAppSelector";
import { selectPlayerOrder } from "../../store/sessionSlice";

const gameDeskVariants = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: -40, opacity: 0 },
};

const GameDesk: FC = () => {
  const playerOrder = useAppSelector(selectPlayerOrder);

  return (
    <motion.div
      className="game-desk"
      variants={gameDeskVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.7 }}
      exit="hidden"
    >
      <div className={`game-desk__cards game-desk__cards--${playerOrder.length}`}>
        {playerOrder.map((id) => (
          <GameDeskCard key={id} playerId={id} />
        ))}
      </div>
    </motion.div>
  );
};

export default GameDesk;
