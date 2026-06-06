import { FC, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Navigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Title from "../../components/Title";
import GameDeskTitle from "../../components/GameDeskTitle";
import Timer from "../../components/Timer";
import GameDesk from "../../components/GameDesk";
import SessionControls from "../../components/SessionControls";
import GameDeskQueueing from "../../components/GameDeskQueueing";
import GameOver from "../../components/GameOver";

import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";

import "./index.scss";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { initializeSession, resetSession } from "../../store/sessionSlice";
import { resetStats } from "../../store/statsSlice";
import { pushNotification } from "../../store/notificationSlice";
import { selectIsGameOver, selectWinnerKey } from "../../store/selectors";

const PLAYER_COUNT_MIN = 4;
const PLAYER_COUNT_MAX = 12;

const SessionPage: FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const isGameOver = useAppSelector(selectIsGameOver);
  const winnerKey = useAppSelector(selectWinnerKey);

  const players = location.state?.players;
  const hasValidPlayers =
    Array.isArray(players) && players.length >= PLAYER_COUNT_MIN && players.length <= PLAYER_COUNT_MAX;

  useEffect(() => {
    if (!hasValidPlayers) return;
    dispatch(initializeSession({ players }));
    return () => {
      dispatch(resetSession());
      dispatch(resetStats());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!location.state) {
    return (
      <Navigate
        to="/welcome"
        replace={true}
        state={{
          page: "session",
          notificationMessage: t("notifications.gameFieldAccess"),
        }}
      />
    );
  }

  if (!hasValidPlayers) {
    dispatch(pushNotification(t("notifications.invalidPlayerCount")));
    return <Navigate to="/settings" replace={true} />;
  }

  return (
    <motion.section initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition} className="session">
      <Title text={t("headers.sessionPage")} />
      <Timer />
      <GameDeskTitle />
      <AnimatePresence>{isGameOver && winnerKey && <GameOver key="gameover" winnerKey={winnerKey} />}</AnimatePresence>
      <div className="session__wrapper">
        <GameDesk />
        <GameDeskQueueing />
      </div>
      <SessionControls />
    </motion.section>
  );
};

export default SessionPage;
