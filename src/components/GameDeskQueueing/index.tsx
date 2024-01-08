import { FC } from "react";
import { AnimatePresence } from "framer-motion";

import Queueing from "../Queueing";

import { IPlayer } from "../../models";

import { useSessionContext } from "../../contexts/SessionContext.tsx";

type GameDeskQueueingProps = {
  listOfPlayers: IPlayer[];
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
