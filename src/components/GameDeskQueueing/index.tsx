import { FC } from "react";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

import Queueing from "../Queueing";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsVotingPanelOpen, selectPlayerOrder, selectQueue } from "../../store/sessionSlice";
import { confirmInstantQueueThunk } from "../../store/thunks";

interface GameDeskQueueingProps {
  handleNotification: (state: boolean, text: string) => void;
}

const GameDeskQueueing: FC<GameDeskQueueingProps> = ({ handleNotification }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isVotingPanelOpen = useAppSelector(selectIsVotingPanelOpen);
  const queue = useAppSelector(selectQueue);
  const amountOfPlayers = useAppSelector((s) => selectPlayerOrder(s).length);

  const handleInstantQueueConfirm = () => {
    if (queue.length !== 1) return;
    handleNotification(true, t("notifications.singlePlayerQueued", { playerId: queue[0] }));
    dispatch(confirmInstantQueueThunk());
  };

  return (
    <AnimatePresence mode="wait">
      {isVotingPanelOpen && (
        <Queueing
          key="queueing"
          queueingPlayers={queue}
          amountOfPlayers={amountOfPlayers}
          onInstantQueueConfirm={handleInstantQueueConfirm}
        />
      )}
    </AnimatePresence>
  );
};

export default GameDeskQueueing;
