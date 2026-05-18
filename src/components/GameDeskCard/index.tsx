import { FC } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Penalty from "../Penalty";

import "./index.scss";

import mutedSvg from "./assets/mute.svg";
import killedSvg from "./assets/killed.svg";
import deletedSvg from "./assets/deleted.svg";
import queuedSvg from "./assets/queued.svg";

import killBtnSvg from "./assets/buttons/kill.svg";
import queueBtnSvg from "./assets/buttons/queue.svg";
import deleteBtnSvg from "./assets/buttons/delete.svg";

import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import {
  selectIsDeleted,
  selectIsKilled,
  selectIsPromoted,
  selectIsQueued,
  selectIsVotingPanelOpen,
  selectPlayerById,
  togglePlayerInQueue,
} from "../../store/sessionSlice";
import { selectIsDay } from "../../store/statsSlice";
import { selectIsMuted } from "../../store/selectors";
import { deletePlayerThunk, killPlayerThunk, queueVoteThunk } from "../../store/thunks";
import { getRoleSrc } from "../../utils/roleAssets";

interface GameDeskCardProps {
  playerId: number;
}

const playerCardVariants = {
  hidden: { opacity: 0, y: -40 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.3 + index * 0.15, duration: 1.5, type: "spring" },
  }),
};

const GameDeskCard: FC<GameDeskCardProps> = ({ playerId }) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const player = useAppSelector(selectPlayerById(playerId));
  const isKilled = useAppSelector(selectIsKilled(playerId));
  const isDeleted = useAppSelector(selectIsDeleted(playerId));
  const isQueued = useAppSelector(selectIsQueued(playerId));
  const isMuted = useAppSelector(selectIsMuted(playerId));
  const isPromoted = useAppSelector(selectIsPromoted(playerId));
  const isDay = useAppSelector(selectIsDay);
  const isVotingPanelOpen = useAppSelector(selectIsVotingPanelOpen);

  if (!player) return null;

  const statusVisible = isMuted || isKilled || isDeleted || isQueued;
  const contextMenuVisible = !(isKilled || isDeleted || isQueued);
  const queueBlocked = !isDay || isKilled || isDeleted || isQueued || isVotingPanelOpen;

  return (
    <motion.div
      className="player game-desk__player"
      variants={playerCardVariants}
      initial="hidden"
      animate="visible"
      custom={playerId}
    >
      <h3 className="player__title">№{playerId}</h3>
      <div className="player__card">
        <span
          className={`player__queue ${isPromoted ? "pressed" : ""} ${queueBlocked ? "disabled" : ""}`}
          onClick={() => dispatch(togglePlayerInQueue({ id: playerId, isDay }))}
        ></span>
        <div className={`player__context-menu ${contextMenuVisible ? "visible" : ""}`}>
          <button
            className="player__button player__button--primary"
            onClick={() => dispatch(killPlayerThunk(playerId))}
          >
            <img src={killBtnSvg} alt="Kill icon" />
            <span>{t("buttons.kill")}</span>
          </button>
          <button
            className="player__button player__button--secondary"
            onClick={() => dispatch(queueVoteThunk(playerId))}
          >
            <img src={queueBtnSvg} alt="Queue icon" />
            <span>{t("buttons.queue")}</span>
          </button>
          <button
            className="player__button player__button--third"
            onClick={() => dispatch(deletePlayerThunk(playerId))}
          >
            <img src={deleteBtnSvg} alt="Delete icon" />
            <span>{t("buttons.delete")}</span>
          </button>
        </div>
        <div className="player__actions">
          <img className="player__image" src={getRoleSrc(player.role)} alt={`Card: ${player.role}`} />
          <div className={`player__status ${statusVisible ? "visible" : ""}`}>
            <AnimatePresence>
              {isMuted && <motion.img exit={{ opacity: 0 }} src={mutedSvg} alt="Mute status" />}
              {isKilled && <motion.img exit={{ opacity: 0 }} src={killedSvg} alt="Killed status" />}
              {isQueued && <motion.img exit={{ opacity: 0 }} src={queuedSvg} alt="Queued status" />}
              {isDeleted && <motion.img exit={{ opacity: 0 }} src={deletedSvg} alt="Deleted status" />}
            </AnimatePresence>
          </div>
        </div>
      </div>
      <Penalty playerId={playerId} />
    </motion.div>
  );
};

export default GameDeskCard;
