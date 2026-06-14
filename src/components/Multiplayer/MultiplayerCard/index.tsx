import { FC } from "react";
import { useTranslation } from "react-i18next";

import { getRoleSrc } from "../../../utils/roleAssets";
import { toRoleKey, useMultiplayerViewer } from "../../../hooks/useMultiplayerViewer";
import { useAppSelector } from "../../../hooks/useAppSelector";
import { SocketEvents } from "../../../store/socket";
import {
  selectLastNightAction,
  selectMyNightAction,
  selectMyVisitedCycle,
  selectNightFloor,
  selectPrivateChecks,
  type LifeStatus,
  type NightActionType,
} from "../../../store/multiplayerSlice";

import backsideSvg from "../../PlayerCard/PlayerCardBackside/backside.svg";
import killedSvg from "../../GameDeskCard/assets/killed.svg";
import deletedSvg from "../../GameDeskCard/assets/deleted.svg";
import queuedSvg from "../../GameDeskCard/assets/queued.svg";
import muteSvg from "../../GameDeskCard/assets/mute.svg";
import putanaVisitedSvg from "../../GameDeskCard/assets/putana_visited.svg";
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
  ROLEBLOCK: "multiplayer.game.actionRoleblock",
};

const STATUS_SVG: Partial<Record<LifeStatus, string>> = {
  KILLED: killedSvg,
  REMOVED: queuedSvg,
  BANNED: deletedSvg,
};

// Max fouls a host can assign before the 4th triggers an automatic ban.
const MAX_PENALTIES = 4;
// Foul dots shown on the card (the 4th foul bans rather than adding a dot).
const PENALTY_DOTS = 3;
// A player stays muted for this many cycles after being muted.
const MUTE_DURATION_CYCLES = 2;
// Default speech timer started when the host hands a seat the floor.
const FLOOR_DURATION_MS = 60_000;

const MultiplayerCard: FC<Props> = ({ seatNumber }) => {
  const { t } = useTranslation();
  const { game, meId, viewerSeat, viewerRole, isHost, isAlive, nightActionType, nominatedSeats, myNomination, myVote } =
    useMultiplayerViewer();
  const myNightAction = useAppSelector(selectMyNightAction);
  const lastNightAction = useAppSelector(selectLastNightAction);
  const nightFloor = useAppSelector(selectNightFloor);
  const myVisitedCycle = useAppSelector(selectMyVisitedCycle);
  const privateChecks = useAppSelector(selectPrivateChecks);

  const seat = game?.seats.find((s) => s.seatNumber === seatNumber);
  if (!game || !seat) return null;

  const { phase } = game;
  const isSelf = meId === seat.userId;
  const dead = seat.lifeStatus !== "ALIVE";
  const roleKey = toRoleKey(seat.role);
  const faceSrc = roleKey ? getRoleSrc(roleKey) : backsideSvg;
  const muted = seat.mutedSinceCycle !== null && game.cycle - seat.mutedSinceCycle < MUTE_DURATION_CYCLES;

  // Sheriff/Don check reveal: once this viewer has checked this seat, flip the
  // card to the target's true role (latest check wins).
  const canFlip = viewerRole === "SHERIFF" || viewerRole === "DON";
  const checkedRole = canFlip
    ? (privateChecks.filter((c) => c.targetSeat === seat.seatNumber && c.result.role).at(-1)?.result.role ?? null)
    : null;
  const revealed = checkedRole !== null;
  const revealedSrc = checkedRole ? getRoleSrc(toRoleKey(checkedRole)!) : faceSrc;

  const showVisited = isSelf && phase === "DAY" && myVisitedCycle === game.cycle;

  const isNominated = nominatedSeats.has(seat.seatNumber);
  const isMyVoteTarget = myVote?.targetSeat === seat.seatNumber;
  const targeted = myNightAction?.targetSeat === seat.seatNumber;
  // Who voted for this seat — votes are public (everyone, host included, sees
  // the tally and the voters).
  const voterSeats = game.currentVotes.filter((v) => v.targetSeat === seat.seatNumber).map((v) => v.actorSeat);

  // Only the seat holding the floor may nominate ("дали слово"). viewerSeat is
  // the seat object — compare its number to the speaker seat.
  const hasFloor = !!viewerSeat && viewerSeat.seatNumber === game.speakerSeat;
  const canNominate =
    !!viewerSeat && hasFloor && isAlive && !myNomination && !isNominated && !isSelf && !dead && phase === "DAY";
  const canVote = !!viewerSeat && isAlive && phase === "VOTING" && isNominated && !dead;
  // Doctor/Putana can't pick the same player two nights running — hide that
  // seat's button this night rather than letting the click error out.
  const repeatBlocked =
    (nightActionType === "DOCTOR_PROTECT" || nightActionType === "ROLEBLOCK") &&
    lastNightAction?.type === nightActionType &&
    lastNightAction.targetSeat === seat.seatNumber &&
    game.cycle === lastNightAction.cycle + 1;
  const canNightAct =
    !!viewerSeat &&
    isAlive &&
    // Doctor may heal self; every other night role still can't self-target.
    (!isSelf || nightActionType === "DOCTOR_PROTECT") &&
    !dead &&
    phase === "NIGHT" &&
    game.cycle > 0 &&
    nightActionType !== null &&
    // Gated: only act when the host has handed your role/team the floor.
    nightFloor === nightActionType &&
    !repeatBlocked &&
    // The night choice is final — once submitted, no re-pick.
    !myNightAction;

  const statusSvg = STATUS_SVG[seat.lifeStatus] ?? null;
  // Diagonal corner ribbon (single-player style): on alive cards — outlined
  // when not nominated, filled when nominated, and a disabled look at night
  // when nominations aren't possible.
  const showQueueRibbon = !dead && phase !== "RESULTS";
  const queueDisabled = phase === "NIGHT";

  const hostActions = isHost && !dead;
  const playerActions = !isHost && (canNominate || canVote || canNightAct);
  const hasMenu = hostActions || playerActions;

  return (
    <div
      className={`mp-card${isSelf ? " mp-card--self" : ""}${
        dead ? " mp-card--dead" : ""
      }${targeted ? " mp-card--targeted" : ""}${seat.connectionStatus === "LEFT" ? " mp-card--left" : ""}${
        viewerSeat && game.speakerSeat === seat.seatNumber ? " mp-card--speaker" : ""
      }`}
    >
      <h3 className="mp-card__title">
        <span className="mp-card__seat">#{seat.seatNumber}</span>
        <span className="mp-card__name">{seat.username}</span>
        {seat.connectionStatus === "OFFLINE" ? (
          <span className="mp-card__conn mp-card__conn--offline">{t("multiplayer.game.statusOffline")}</span>
        ) : seat.connectionStatus === "LEFT" ? (
          <span className="mp-card__conn mp-card__conn--left">{t("multiplayer.game.statusLeft")}</span>
        ) : null}
      </h3>

      <div className="mp-card__card">
        {/* Two-step check reveal (sheriff/don): backside rotates out first, then
            the role front rotates in (sequenced via transition-delay). */}
        <img
          className={`mp-card__image${canFlip && !revealed ? " mp-card__image--hidden" : ""}`}
          src={revealedSrc}
          alt=""
        />
        {canFlip ? (
          <img
            className={`mp-card__reveal-back${revealed ? " mp-card__reveal-back--flipped" : ""}`}
            src={faceSrc}
            alt=""
          />
        ) : null}
        {showVisited ? (
          <div className="mp-card__status">
            <img src={putanaVisitedSvg} alt="" />
          </div>
        ) : null}
        {showQueueRibbon ? (
          <span
            className={`mp-card__queue${isNominated ? " mp-card__queue--on" : ""}${
              queueDisabled ? " mp-card__queue--disabled" : ""
            }`}
            aria-hidden
          />
        ) : null}
        {muted ? <img className="mp-card__muted" src={muteSvg} alt="" /> : null}
        {statusSvg ? (
          <div className="mp-card__status">
            <img src={statusSvg} alt="" />
          </div>
        ) : null}

        {/* Vote tally tray overlaid on the bottom of the card art (only when
            votes exist). Absolute, so it never shifts the grid layout. */}
        {phase === "VOTING" && voterSeats.length > 0 ? (
          <div className="mp-card__votes" title={voterSeats.map((s) => `#${s}`).join(" ")}>
            <span className="mp-card__votes-count">
              <svg viewBox="0 0 24 24" aria-hidden focusable="false">
                <path
                  d="M5 11.5 10 16.5 19 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {voterSeats.length}
            </span>
            <div className="mp-card__votes-chips">
              {voterSeats.map((s) => (
                <span key={s} className="mp-card__votes-chip">
                  #{s}
                </span>
              ))}
            </div>
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
                {phase === "DAY" ? (
                  <button
                    type="button"
                    className={`player__button ${
                      game.speakerSeat === seat.seatNumber ? "player__button--primary" : "player__button--secondary"
                    }`}
                    onClick={() => SocketEvents.giveFloor(game.id, seat.seatNumber, FLOOR_DURATION_MS)}
                  >
                    <span>
                      {game.speakerSeat === seat.seatNumber
                        ? t("multiplayer.game.hasFloor")
                        : t("multiplayer.game.giveFloor")}
                    </span>
                  </button>
                ) : null}
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
                    disabled={seat.penaltyCount >= MAX_PENALTIES}
                  >
                    <span>{t("multiplayer.game.penaltyPlus")}</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mp-card__penalty">
        {Array.from({ length: PENALTY_DOTS }, (_, i) => i + 1).map((n) => (
          <span key={n} className={`mp-card__foul${seat.penaltyCount >= n ? " mp-card__foul--on" : ""}`} />
        ))}
      </div>
    </div>
  );
};

export default MultiplayerCard;
