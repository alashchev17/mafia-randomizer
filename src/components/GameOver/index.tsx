import { FC } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import Title from "../Title";

import "./index.scss";
import { useSessionContext } from "../../contexts/SessionContext.tsx";

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

  const { gameStats } = useSessionContext();
  const stats = gameStats.history;

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
      <div className="gameover__row">
        <Link
          className="button button--primary"
          to="/stats"
          state={{
            stats,
            winner,
          }}
          replace={true}
        >
          Посмотреть историю
        </Link>
        <Link
          style={{ display: "block" }}
          className="button button--secondary"
          to="/welcome"
          replace={true}
        >
          Вернуться на главную
        </Link>
      </div>
    </motion.div>
  );
};

export default GameOver;
