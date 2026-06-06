import { FC } from "react";
import { useTranslation } from "react-i18next";

import { getRoleSrc } from "../../../utils/roleAssets";
import { toRoleKey, useMultiplayerViewer } from "../../../hooks/useMultiplayerViewer";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { SocketEvents } from "../../../store/socket";
import { selectMyNightAction, type LifeStatus, type NightActionType } from "../../../store/multiplayerSlice";

import backsideSvg from "../../PlayerCard/PlayerCardBackside/backside.svg";
import killedSvg from "../../GameDeskCard/assets/killed.svg";
import deletedSvg from "../../GameDeskCard/assets/deleted.svg";
import queuedSvg from "../../GameDeskCard/assets/queued.svg";
import muteSvg from "../../GameDeskCard/assets/mute.svg";
import killBtnSvg from "../../GameDeskCard/assets/buttons/kill.svg";
import queueBtnSvg from "../../GameDeskCard/assets/buttons/queue.svg";
import deleteBtnSvg from "../../GameDeskCard/assets/buttons/delete.svg";

import "./index.scss";

interface Props {
  seatNumber: number;
}

const NIGHT_ACTION_LABEL: Record<NightActionType, string> = {
  MAFIA_KILL_VOTE: "multiplayer.game.actionKill",
  DON_CHECK_SHERIFF: "multiplayer.game.actionCheck",
  SHERIFF_CHECK: "multiplayer.game.actionCheck",
  DOCTOR_PROTECT: "multiplayer.game.actionProtect",
};

const STATUS_SVG: Partial<Record<LifeStatus, string>> = {
  KILLED: killedSvg,
  REMOVED: queuedSvg,
  BANNED: deletedSvg,
};

const MultiplayerCard: FC<Props> = ({ seatNumber }) => {
  const { t } = useTranslation();
  const {
    game,
    meId,
    viewerSeat,
    isHost,
    isAlive,
    nightActionType,
    nominatedSeats,
    nominationByTarget,
    myNomination,
    myVote,
  } = useMultiplayerViewer();
  const myNightAction = useAppSelector(selectMyNightAction);

  const seat = game?.seats.find((s) => s.seatNumber === seatNumber);
  if (!game || !seat) return null;

  const { phase } = game;
  const isSelf = meId === seat.userId;
  const dead = seat.lifeStatus !== "ALIVE";
  const roleKey = toRoleKey(seat.role);
  const faceSrc = roleKey ? getRoleSrc(roleKey) : backsideSvg;
  const muted = seat.mutedSinceCycle !== null && game.cycle - seat.mutedSinceCycle < 2;

  const isNominated = nominatedSeats.has(seat.seatNumber);
  const nominatorSeat = nominationByTarget.get(seat.seatNumber);
  const isMyVoteTarget = myVote?.targetSeat === seat.seatNumber;
  const targeted = myNightAction?.targetSeat === seat.seatNumber;

  const canNominate = !!viewerSeat && isAlive && !myNomination && !isNominated && !isSelf && !dead && phase === "DAY";
  const canVote = !!viewerSeat && isAlive && phase === "VOTING" && isNominated && !dead;
  const canNightAct =
    !!viewerSeat && isAlive && !isSelf && !dead && phase === "NIGHT" && game.cycle > 0 && nightActionType !== null;

  const statusSvg = STATUS_SVG[seat.lifeStatus] ?? null;

  const hostActions = isHost && !dead;
  const playerActions = !isHost && (canNominate || canVote || canNightAct);
  const hasMenu = hostActions || playerActions;

  const nominatorLabel = nominatorSeat === 0 ? t("multiplayer.game.host") : `#${nominatorSeat ?? ""}`;

  return (
    <div
      className={`mp-card${isSelf ? " mp-card--self" : ""}${
        dead ? " mp-card--dead" : ""
      }${targeted ? " mp-card--targeted" : ""}`}
    >
      <h3 className="mp-card__title">
        <span className="mp-card__seat">#{seat.seatNumber}</span>
        <span className="mp-card__name">{seat.username}</span>
        {seat.connectionStatus !== "ONLINE" ? (
          <span className="mp-card__offline" title={seat.connectionStatus} />
        ) : null}
      </h3>

      <div className="mp-card__card">
        <img className="mp-card__image" src={faceSrc} alt="" />
        {muted ? <img className="mp-card__muted" src={muteSvg} alt="" /> : null}
        {statusSvg ? (
          <div className="mp-card__status">
            <img src={statusSvg} alt="" />
          </div>
        ) : null}
        {hasMenu ? (
          <div className="mp-card__menu">
            {!isHost && canNominate ? (
              <button
                type="button"
                className="player__button player__button--secondary"
                onClick={() => SocketEvents.nominate(game.id, seat.seatNumber)}
              >
                <img src={queueBtnSvg} alt="" />
                <span>{t("multiplayer.game.nominateButton")}</span>
              </button>
            ) : null}

            {!isHost && canVote ? (
              <button
                type="button"
                className="player__button player__button--secondary"
                onClick={() => SocketEvents.vote(game.id, seat.seatNumber)}
                disabled={isMyVoteTarget}
              >
                <img src={queueBtnSvg} alt="" />
                <span>{isMyVoteTarget ? t("multiplayer.game.votedFor") : t("multiplayer.game.voteFor")}</span>
              </button>
            ) : null}

            {!isHost && canNightAct && nightActionType ? (
              <button
                type="button"
                className={`player__button ${targeted ? "player__button--primary" : "player__button--secondary"}`}
                onClick={() => SocketEvents.nightAction(game.id, nightActionType, seat.seatNumber)}
              >
                {nightActionType === "MAFIA_KILL_VOTE" ? <img src={killBtnSvg} alt="" /> : null}
                <span>{targeted ? t("multiplayer.game.targeted") : t(NIGHT_ACTION_LABEL[nightActionType])}</span>
              </button>
            ) : null}

            {isHost ? (
              <>
                <button
                  type="button"
                  className="player__button player__button--primary"
                  onClick={() => SocketEvents.hostNightKill(game.id, seat.seatNumber)}
                >
                  <img src={killBtnSvg} alt="" />
                  <span>{t("multiplayer.game.hostKill")}</span>
                </button>
                <button
                  type="button"
                  className="player__button player__button--secondary"
                  onClick={() => SocketEvents.hostNominate(game.id, seat.seatNumber)}
                  disabled={isNominated}
                >
                  <img src={queueBtnSvg} alt="" />
                  <span>{t("multiplayer.game.hostNominate")}</span>
                </button>
                <button
                  type="button"
                  className="player__button player__button--third"
                  onClick={() => SocketEvents.hostVoteResult(game.id, seat.seatNumber)}
                >
                  <img src={deleteBtnSvg} alt="" />
                  <span>{t("multiplayer.game.hostRemove")}</span>
                </button>
                <div className="mp-card__fouls">
                  <button
                    type="button"
                    className="player__button player__button--third"
                    onClick={() => SocketEvents.hostPenalty(game.id, seat.seatNumber, -1)}
                    disabled={seat.penaltyCount === 0}
                  >
                    <span>{t("multiplayer.game.penaltyMinus")}</span>
                  </button>
                  <button
                    type="button"
                    className="player__button player__button--third"
                    onClick={() => SocketEvents.hostPenalty(game.id, seat.seatNumber, 1)}
                    disabled={seat.penaltyCount >= 4}
                  >
                    <span>{t("multiplayer.game.penaltyPlus")}</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      {(phase === "DAY" || phase === "VOTING") && isNominated ? (
        <span className="mp-card__nominated-by">{t("multiplayer.game.nominatedBy", { who: nominatorLabel })}</span>
      ) : null}

      <div className="mp-card__penalty">
        {[1, 2, 3].map((n) => (
          <span key={n} className={`mp-card__foul${seat.penaltyCount >= n ? " mp-card__foul--on" : ""}`} />
        ))}
      </div>
    </div>
  );
};

export default MultiplayerCard;
