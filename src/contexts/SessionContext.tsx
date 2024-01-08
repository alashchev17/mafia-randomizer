import React, { createContext, useContext, useState } from "react";
import { IGameStats } from "../models";

type SessionContextType = {
  gameStats: IGameStats;
  queueingPlayers: number[];
  isQueueing: boolean;
  isInstantQueue: boolean;
  setGameStats: React.Dispatch<React.SetStateAction<IGameStats>>;
  setQueueingPlayers: React.Dispatch<React.SetStateAction<number[]>>;
  setIsQueueing: React.Dispatch<React.SetStateAction<boolean>>;
  setIsInstantQueue: React.Dispatch<React.SetStateAction<boolean>>;
};

export const SessionContext = createContext<SessionContextType | null>(null);

type SessionContextProviderProps = {
  children?: React.ReactNode;
};

export default function SessionContextProvider({
  children,
}: SessionContextProviderProps) {
  const [gameStats, setGameStats] = useState({
    type: "Ночь",
    counter: 0,
    history: [],
  } as IGameStats);
  const [queueingPlayers, setQueueingPlayers] = useState<number[]>([]);
  const [isQueueing, setIsQueueing] = useState(false);
  const [isInstantQueue, setIsInstantQueue] = useState(false);

  return (
    <SessionContext.Provider
      value={{
        gameStats,
        queueingPlayers,
        isQueueing,
        isInstantQueue,
        setGameStats,
        setQueueingPlayers,
        setIsQueueing,
        setIsInstantQueue,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSessionContext = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error(
      "useSessionContext should be consumed within SessionContextProvider",
    );
  }
  return context;
};
