import { FC } from "react";
import Queueing from "../Queueing";
import { useSessionContext } from "../../contexts/SessionContext.tsx";
import { IPlayers } from "../../models";
import { AnimatePresence } from "framer-motion";

type GameDeskQueueingProps = {
  listOfPlayers: IPlayers[];
};

const GameDeskQueueing: FC<GameDeskQueueingProps> = ({ listOfPlayers }) => {
  const { isQueueing, queueingPlayers, setIsInstantQueue } =
    useSessionContext();

  const handleInstantQueue = (state: boolean) => {
    setIsInstantQueue(state);
  };

  return (
    <AnimatePresence mode="wait">
      {isQueueing && (
        <Queueing
          key="queueing"
          queueingPlayers={queueingPlayers}
          amountOfPlayers={listOfPlayers.length}
          handleInstantQueue={handleInstantQueue}
        />
      )}
    </AnimatePresence>
  );
};

export default GameDeskQueueing;
