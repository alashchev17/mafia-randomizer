import { FC, useEffect, useState } from "react";
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

import { IPlayers } from "../../models";

import "./index.scss";
import GameOver from "../../components/GameOver";

interface SessionPageProps {
  handleNotification: (state: boolean, text: string) => void;
}

const SessionPage: FC<SessionPageProps> = ({ handleNotification }) => {
  const location = useLocation();
  const innocentPlayers: number = location.state.innocentPlayers
    ? location.state.innocentPlayers
    : 0;
  const mafiaPlayers: number = location.state.mafiaPlayers
    ? location.state.mafiaPlayers
    : 0;

  const [gameStats, setGameStats] = useState({
    type: "Ночь",
    counter: 0,
  });
  const [queueingPlayers, setQueueingPlayers] = useState<number[]>([]);
  const [isQueueing, setIsQueueing] = useState(false);

  const [innocentPlayersAlive, setInnocentPlayersAlive] =
    useState(innocentPlayers);
  const [mafiaPlayersAlive, setMafiaPlayersAlive] = useState(mafiaPlayers);

  const [isGameOver, setIsGameOver] = useState(false);

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

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (mafiaPlayersAlive < 1 || mafiaPlayersAlive === innocentPlayersAlive) {
        setIsGameOver(true);
      }
    }, [isGameOver, mafiaPlayersAlive, innocentPlayersAlive]);

    const sessionStyles = {
      overflow: isGameOver ? "hidden" : "auto",
      height: isGameOver ? "calc(100vh - 85px)" : "auto",
    };

    return (
      <motion.section
        initial={pagesInitial}
        animate={pagesAnimate}
        transition={pagesTransition}
        className="session"
        style={sessionStyles}
      >
        <Title text="Таймер & Игровое поле" />
        <Timer handleNotification={handleNotification} />
        <Title text={`${gameStats.type} – ${gameStats.counter}`} />
        <AnimatePresence>
          {isGameOver && (
            <GameOver
              key="gameover"
              winner={
                mafiaPlayersAlive === innocentPlayersAlive
                  ? "Мафия"
                  : "Мирные жители"
              }
            />
          )}
        </AnimatePresence>
        <div className="session__wrapper">
          <GameDesk
            players={listOfPlayers}
            queueingPlayers={queueingPlayers}
            setQueueingPlayers={setQueueingPlayers}
            setInnocentPlayersAlive={setInnocentPlayersAlive}
            setMafiaPlayersAlive={setMafiaPlayersAlive}
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
