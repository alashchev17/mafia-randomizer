import { FC, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, useLocation } from "react-router-dom";

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

import { IGameStats, IPlayers } from "../../models";

import "./index.scss";
import GameOver from "../../components/GameOver";

interface SessionPageProps {
  handleNotification: (state: boolean, text: string) => void;
}

const SessionPage: FC<SessionPageProps> = ({ handleNotification }) => {
  const location = useLocation();
  const innocentPlayers: number = location.state?.innocentPlayers
    ? location.state.innocentPlayers
    : 0;
  const mafiaPlayers: number = location.state?.mafiaPlayers
    ? location.state.mafiaPlayers
    : 0;

  const [gameStats, setGameStats] = useState({
    type: "Ночь",
    counter: 0,
    history: [],
  } as IGameStats);
  const [queueingPlayers, setQueueingPlayers] = useState<number[]>([]);
  const [isQueueing, setIsQueueing] = useState(false);
  const [innocentPlayersAlive, setInnocentPlayersAlive] =
    useState(innocentPlayers);
  const [mafiaPlayersAlive, setMafiaPlayersAlive] = useState(mafiaPlayers);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isInstantQueue, setIsInstantQueue] = useState(false);
  const winner = useRef("Ничья");

  useEffect(() => {
    if (mafiaPlayersAlive < 1 || mafiaPlayersAlive === innocentPlayersAlive) {
      winner.current =
        mafiaPlayersAlive === innocentPlayersAlive ? "Мафия" : "Мирные жители";
      setIsGameOver(true);
    }
  }, [isGameOver, mafiaPlayersAlive, innocentPlayersAlive]);

  if (!location.state) {
    return (
      <Navigate
        to="/welcome"
        replace={true}
        state={{
          page: "session",
          notificationMessage: "Игровое поле доступно только после старта!",
        }}
      />
    );
  }

  const listOfPlayers: IPlayers[] = location.state.players;

  if (listOfPlayers.length > 12 || listOfPlayers.length < 6) {
    handleNotification(true, "Некорректное количество игроков!");
    return <Navigate to="/settings" replace={true} />;
  }
  const handleStats = () => {
    setGameStats((prev) => {
      return {
        ...prev,
        type: prev.type === "Ночь" ? "День" : "Ночь",
        counter: prev.type === "День" ? prev.counter + 1 : prev.counter,
        history: [...prev.history],
      };
    });
  };

  const handleQueue = () => {
    setIsQueueing((prev) => !prev);
  };

  const handleGameOver = () => {
    if (window.confirm("Вы действительно хотите завершить партию?")) {
      setIsGameOver((prev) => !prev);
    }
  };

  // function which handles if only one player was promoted on queueing process
  const handleInstantQueue = (state: boolean) => {
    setIsInstantQueue(state);
  };

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
      <AnimatePresence>
        {isGameOver && (
          <GameOver
            key="gameover"
            winner={winner.current}
            stats={gameStats.history}
          />
        )}
      </AnimatePresence>
      <div className="session__wrapper">
        <GameDesk
          players={listOfPlayers}
          queueingPlayers={queueingPlayers}
          isInstantQueue={isInstantQueue}
          isQueueing={isQueueing}
          setIsQueueing={setIsQueueing}
          setQueueingPlayers={setQueueingPlayers}
          setInnocentPlayersAlive={setInnocentPlayersAlive}
          setMafiaPlayersAlive={setMafiaPlayersAlive}
          gameStats={gameStats}
          setGameStats={setGameStats}
          handleNotification={handleNotification}
        />
        <AnimatePresence>
          {isQueueing && (
            <Queueing
              key="queueing"
              queueingPlayers={queueingPlayers}
              amountOfPlayers={listOfPlayers.length}
              handleInstantQueue={handleInstantQueue}
            />
          )}
        </AnimatePresence>
      </div>
      <div className="session__controls">
        <Button
          className={
            gameStats.type === "День" ? "button--third" : "button--primary"
          }
          text={gameStats.type === "День" ? "Следующая ночь" : "Следующий день"}
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
        <button className="button button--secondary" onClick={handleGameOver}>
          Завершить партию
        </button>
      </div>
    </motion.section>
  );
};

export default SessionPage;
