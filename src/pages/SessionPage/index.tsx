import { FC } from "react";
import { motion } from "framer-motion";
import { Navigate, useLocation } from "react-router-dom";

import Timer from "../../components/Timer";
import GameDesk from "../../components/GameDesk";

import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation";

import "./index.scss";

interface SessionPageProps {
  handleNotification: (
    state: boolean,
    title: string,
    text: string,
    information: string,
  ) => void;
}

const SessionPage: FC<SessionPageProps> = ({ handleNotification }) => {
  const location = useLocation();
  if (location.state) {
    const listOfPlayers = location.state.players;

    if (listOfPlayers.length > 12 || listOfPlayers.length < 6) {
      handleNotification(
        true,
        "Ошибка",
        "Некорректное количество игроков!",
        `Пересохраните настройки партии`,
      );
      return <Navigate to="/settings" replace={true} />;
    }

    return (
      <motion.section
        initial={pagesInitial}
        animate={pagesAnimate}
        transition={pagesTransition}
        className="session"
      >
        <Timer handleNotification={handleNotification} />
        <GameDesk players={listOfPlayers} />
      </motion.section>
    );
  } else {
    return <Navigate to="/welcome" replace={true} />;
  }
};

export default SessionPage;
