import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Navigate, useLocation } from "react-router-dom";

import Title from "../../components/Title";
import Button from "../../components/Button";
import Timer from "../../components/Timer";
import GameDesk from "../../components/GameDesk";
import Queueing from "../../components/Queueing";

import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation";

import "./index.scss";
import { IPlayers } from "../../models";

interface SessionPageProps {
  handleNotification: (state: boolean, text: string) => void;
}

const SessionPage: FC<SessionPageProps> = ({ handleNotification }) => {
  const location = useLocation();

  location.state = {
    players: [
      {
        role: "Мирный житель",
        roleSrc: "/cards/innocent.svg",
      },
      {
        role: "Шериф",
        roleSrc: "/cards/sheriff.svg",
      },
      {
        role: "Мафия",
        roleSrc: "/cards/mafia.svg",
      },
      {
        role: "Мирный житель",
        roleSrc: "/cards/innocent.svg",
      },
      {
        role: "Дон",
        roleSrc: "/cards/headOfMafia.svg",
      },
      {
        role: "Мирный житель",
        roleSrc: "/cards/innocent.svg",
      },
    ],
  };

  const [gameStats, setGameStats] = useState({
    type: "Ночь",
    counter: 0,
  });

  const [queueingPlayers, setQueueingPlayers] = useState<number[]>([]);

  const [isQueueing, setIsQueueing] = useState(false);

  if (location.state) {
    const listOfPlayers: IPlayers[] = location.state.players;

    const handleStats = () => {
      setGameStats((prev) => {
        return {
          type: prev.type === "Ночь" ? "День" : "Ночь",
          counter: prev.type === "Ночь" ? prev.counter : prev.counter + 1,
        };
      });
    };

    const handleQueue = () => {
      setIsQueueing((prev) => !prev);
    };

    if (listOfPlayers.length > 12 || listOfPlayers.length < 6) {
      handleNotification(true, "Некорректное количество игроков!");
      return <Navigate to="/settings" replace={true} />;
    }

    return (
      <motion.section
        initial={pagesInitial}
        animate={pagesAnimate}
        transition={pagesTransition}
        className="session"
      >
        <Title text="Таймер & Игровое поле" />
        <Timer handleNotification={handleNotification} />
        <Title text={`${gameStats.type} – ${gameStats.counter}`} />
        <div className="session__wrapper">
          <GameDesk
            players={listOfPlayers}
            queueingPlayers={queueingPlayers}
            setQueueingPlayers={setQueueingPlayers}
            gameTime={gameStats.type}
            cycleCount={gameStats.counter}
          />
          <AnimatePresence>
            {isQueueing && (
              <Queueing
                key="queueing"
                queueingPlayers={queueingPlayers}
                amountOfPlayers={listOfPlayers.length}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="session__controls">
          <Button
            className={
              gameStats.type === "День" ? "button--third" : "button--primary"
            }
            text={
              gameStats.type === "День" ? "Следующая ночь" : "Следующий день"
            }
            clickHandle={handleStats}
            disabled={isQueueing}
          />
          <AnimatePresence>
            {gameStats.type === "День" && (
              <Button
                className="button--primary"
                text={isQueueing ? "Скрыть голосование" : "Голосование"}
                clickHandle={handleQueue}
                disabled={queueingPlayers.length < 1}
              ></Button>
            )}
          </AnimatePresence>
          <Link
            className="button button--secondary"
            to="/welcome"
            replace={true}
          >
            Завершить партию
          </Link>
        </div>
      </motion.section>
    );
  } else {
    handleNotification(true, "Игровое поле доступно только после старта!");
    return <Navigate to="/welcome" replace={true} />;
  }
};

export default SessionPage;
