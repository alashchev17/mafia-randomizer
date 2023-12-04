import { FC, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, Navigate, useLocation } from "react-router-dom";

import Title from "../../components/Title";
import Button from "../../components/Button";
import Timer from "../../components/Timer";
import GameDesk from "../../components/GameDesk";

import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation";

import "./index.scss";
import Queueing from "../../components/Queueing";

interface SessionPageProps {
  handleNotification: (state: boolean, text: string) => void;
}

const SessionPage: FC<SessionPageProps> = ({ handleNotification }) => {
  const location = useLocation();

  // remove next line on production
  // location.state = {
  //   players: [
  //     {
  //       role: "Мирный житель",
  //       roleSrc: "/cards/innocent.svg",
  //     },
  //     {
  //       role: "Шериф",
  //       roleSrc: "/cards/sheriff.svg",
  //     },
  //     {
  //       role: "Мафия",
  //       roleSrc: "/cards/mafia.svg",
  //     },
  //     {
  //       role: "Мирный житель",
  //       roleSrc: "/cards/innocent.svg",
  //     },
  //     {
  //       role: "Дон",
  //       roleSrc: "/cards/headOfMafia.svg",
  //     },
  //     {
  //       role: "Мирный житель",
  //       roleSrc: "/cards/innocent.svg",
  //     },
  //   ],
  // };

  const [gameStats, setGameStats] = useState({
    type: "Ночь",
    counter: 0,
  });

  const [queueingPlayers, setQueueingPlayers] = useState<number[]>([]);
  const [isQueueing, setIsQueueing] = useState(false);

  if (location.state) {
    const listOfPlayers = location.state.players;

    const handleStats = () => {
      setGameStats((prev) => {
        return {
          type: prev.type === "Ночь" ? "День" : "Ночь",
          counter: prev.type === "Ночь" ? prev.counter : prev.counter + 1,
        };
      });
    };

    const handleQueue = () => {
      // alert("[" + queueingPlayers + "]");
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
        <AnimatePresence mode="wait">
          {!isQueueing && (
            <GameDesk
              key="gameDesk"
              players={listOfPlayers}
              queueingPlayers={queueingPlayers}
              setQueueingPlayers={setQueueingPlayers}
              gameTime={gameStats.type}
            />
          )}
          {isQueueing && (
            <Queueing key="queueing" queueingPlayers={queueingPlayers} />
          )}
        </AnimatePresence>
        <div className="session__controls">
          <Button
            className={
              gameStats.type === "День" ? "button--third" : "button--primary"
            }
            text={
              gameStats.type === "День" ? "Следующая ночь" : "Следующий день"
            }
            clickHandle={handleStats}
          />
          <AnimatePresence>
            {gameStats.type === "День" && (
              <Button
                className="button--primary"
                text={isQueueing ? "Игровое поле" : "Голосование"}
                clickHandle={handleQueue}
                disabled={queueingPlayers.length < 1}
              ></Button>
            )}
          </AnimatePresence>
        </div>
        <Link className="button button--secondary" to="/welcome" replace={true}>
          Завершить партию
        </Link>
      </motion.section>
    );
  } else {
    return <Navigate to="/welcome" replace={true} />;
  }
};

export default SessionPage;
