import { FC } from "react";

import "./index.scss";
import Title from "../Title";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface GameOverProps {
  winner: string;
}

const GameOver: FC<GameOverProps> = ({ winner }) => {
  const gameOverVariants = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };

  return (
    <motion.div
      variants={gameOverVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="gameover"
    >
      <Title text="Партия завершена!" />
      <p className="gameover__winner">
        Команда-победитель: <span className="gameover__team">{winner}</span>
      </p>
      <Link
        style={{ display: "block" }}
        className="button button--secondary"
        to="/welcome"
        replace={true}
      >
        Вернуться на главную
      </Link>
    </motion.div>
  );
};

export default GameOver;
