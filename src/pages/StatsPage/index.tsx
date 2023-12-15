import { FC } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";

import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation.ts";
import { IGameHistory } from "../../models";

import "./index.scss";

const StatsPage: FC = () => {
  const location = useLocation();
  const { stats, winner } = location.state;
  if (stats) {
    const winnerClassNames = `stats__winner ${
      winner === "Мафия" ? "stats__winner--mafia" : "stats__winner--innocent"
    }`;

    return (
      <motion.div
        className="stats"
        initial={pagesInitial}
        animate={pagesAnimate}
        transition={pagesTransition}
      >
        <Title text="Результаты игры" />
        <h2 className="stats__subtitle">Команда-победитель</h2>
        <span className={winnerClassNames}>{winner}</span>
        <h2 className="stats__subtitle">История подъёма игроков</h2>
        <ul className="stats__list">
          {stats.map((item: IGameHistory) => (
            <li className="stats__list-item" key={item.playerId}>
              <div className="stats__list-player">
                Игрок №{item.playerId}
                <img src={item.playerCard} alt="Card: Player Card" />
              </div>
              <div className="stats__list-description">
                <span>
                  Время суток:{" "}
                  <span className="stats__strong">{item.timestamp.type}</span>
                </span>
                <span>
                  Игровой круг:{" "}
                  <span className="stats__strong">{item.timestamp.cycle}</span>
                </span>
                <span>
                  Причина подъёма:{" "}
                  <span className="stats__strong">{item.reason}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Link className="button button--primary" to="/welcome" replace={true}>
          Вернуться на главную
        </Link>
      </motion.div>
    );
  } else {
    return <Navigate to="/" replace={true} />;
  }
};

export default StatsPage;
