import { FC, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Title from "../../components/Title";
import Avatar from "../../components/Avatar";
import CenteredMessage from "../../components/CenteredMessage";

import { useGetGameQuery, useGetGameLogQuery } from "../../store/api/gamesApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";
import { getRoleSrcByKey } from "../../utils/roleAssets";
import { formatLogEntry } from "../../utils/formatLogEntry";

import "./index.scss";

const formatTime = (iso: string, language: string): string =>
  new Intl.DateTimeFormat(language, { hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(new Date(iso));

const GameDetailPage: FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { gameId = "" } = useParams();

  const { data: game, isLoading: gameLoading, error: gameError } = useGetGameQuery(gameId, { skip: !gameId });
  const { data: log, isLoading: logLoading } = useGetGameLogQuery(gameId, { skip: !gameId });

  useEffect(() => {
    document.title = t("titles.gameDetailPage");
  }, [t]);

  if (gameLoading) {
    return (
      <CenteredMessage base="game-detail">
        <p>{t("gameDetail.loading")}</p>
      </CenteredMessage>
    );
  }

  if (gameError || !game) {
    return (
      <CenteredMessage base="game-detail">
        <p className="game-detail__error">{t("gameDetail.error")}</p>
        <Link className="button button--outline" to="/profile">
          {t("gameDetail.back")}
        </Link>
      </CenteredMessage>
    );
  }

  const winnerKey = game.winner === "MAFIA" ? "mafia" : "innocent";
  const winnerClass = `game-detail__winner game-detail__winner--${winnerKey}`;

  return (
    <motion.section className="game-detail" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <Title text={t("gameDetail.title")} />

      <div className="game-detail__summary">
        {game.winner ? (
          <span className={winnerClass}>{t(`multiplayer.team.${game.winner}`)}</span>
        ) : (
          <span className="game-detail__winner game-detail__winner--none">{t("gameDetail.noWinner")}</span>
        )}
        {game.finishReason ? (
          <span className="game-detail__reason">
            {t(`gameDetail.finishReason.${game.finishReason}`, { defaultValue: game.finishReason })}
          </span>
        ) : null}
      </div>

      <h2 className="game-detail__subtitle">{t("gameDetail.players")}</h2>
      <ul className="game-detail__seats">
        {[...game.seats]
          .sort((a, b) => a.seatNumber - b.seatNumber)
          .map((seat) => (
            <li className="game-detail__seat" key={seat.userId}>
              <span className="game-detail__seat-num">#{seat.seatNumber}</span>
              {seat.role ? (
                <img
                  className="game-detail__seat-card"
                  src={getRoleSrcByKey(seat.role)}
                  alt={t(`profile.role.${seat.role}`)}
                />
              ) : null}
              <Avatar username={seat.username} avatarUrl={seat.avatarUrl} size="sm" />
              <span className="game-detail__seat-name">{seat.username}</span>
              {seat.role ? <span className="game-detail__seat-role">{t(`profile.role.${seat.role}`)}</span> : null}
              <span className="game-detail__seat-life">{t(`profile.lifeStatus.${seat.lifeStatus}`)}</span>
            </li>
          ))}
      </ul>

      <h2 className="game-detail__subtitle">{t("gameDetail.log")}</h2>
      {logLoading ? <p className="game-detail__hint">{t("gameDetail.loading")}</p> : null}
      {!logLoading && (!log || log.length === 0) ? (
        <p className="game-detail__hint">{t("gameDetail.logEmpty")}</p>
      ) : null}
      {log && log.length > 0 ? (
        <ul className="game-detail__log">
          {log.map((entry) =>
            entry.type === "PHASE_CHANGE" ? (
              <li key={entry.id} className="game-detail__log-phase">
                <span className="game-detail__log-phase-line" />
                <span className="game-detail__log-phase-label">{formatLogEntry(t, entry)}</span>
                <span className="game-detail__log-phase-line" />
              </li>
            ) : (
              <li key={entry.id} className="game-detail__log-item">
                <span className="game-detail__log-cycle">{entry.cycle + 1}</span>
                <span className="game-detail__log-text">{formatLogEntry(t, entry)}</span>
                <span className="game-detail__log-time">{formatTime(entry.createdAt, language)}</span>
              </li>
            )
          )}
        </ul>
      ) : null}

      <Link className="button button--primary" to="/profile">
        {t("gameDetail.back")}
      </Link>
    </motion.section>
  );
};

export default GameDetailPage;
