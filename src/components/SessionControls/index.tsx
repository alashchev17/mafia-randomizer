import React, { FC } from "react";
import Button from "../Button";
import { AnimatePresence } from "framer-motion";
import { useSessionContext } from "../../contexts/SessionContext.tsx";

type SessionControlsProps = {
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
};

const SessionControls: FC<SessionControlsProps> = ({ setIsGameOver }) => {
  const {
    gameStats,
    setGameStats,
    isQueueing,
    setIsQueueing,
    queueingPlayers,
  } = useSessionContext();

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

  return (
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
          />
        )}
      </AnimatePresence>
      <Button
        className="button--secondary"
        text="Завершить партию"
        clickHandle={handleGameOver}
      />
    </div>
  );
};

export default SessionControls;
