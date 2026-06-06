import { FC, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { skipToken } from "@reduxjs/toolkit/query";

import Avatar from "../../components/Avatar";
import { useMeQuery } from "../../store/api/authApi";
import { useListGamesQuery, type GameListItem } from "../../store/api/gamesApi";
import { useLanguage } from "../../contexts/LanguageContext";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";
import { formatRatingDelta } from "../../utils/format";

import "./index.scss";

const DEFAULT_LIMIT = 20;

const formatDate = (iso: string | null, language: string): string => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(language, {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
};

const formatDateTime = (iso: string | null, language: string): string => {
  if (!iso) return "—";
  return new Intl.DateTimeFormat(language, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
};

const deltaClass = (delta: number): string => {
  if (delta > 0) return "profile__delta profile__delta--up";
  if (delta < 0) return "profile__delta profile__delta--down";
  return "profile__delta profile__delta--zero";
};

const ProfilePage: FC = () => {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const { data: user, isLoading: userLoading, error: userError } = useMeQuery();
  const [offset, setOffset] = useState(0);

  const gamesArg = user ? { userId: user.id, limit: DEFAULT_LIMIT, offset } : skipToken;
  const {
    data: games,
    isLoading: gamesLoading,
    isFetching: gamesFetching,
    error: gamesError,
  } = useListGamesQuery(gamesArg);

  useEffect(() => {
    document.title = t("titles.profilePage");
  }, [t]);

  const winrate = useMemo(() => {
    if (!user || user.gamesPlayed === 0) return "—";
    return `${Math.round((user.wins / user.gamesPlayed) * 100)}%`;
  }, [user]);

  if (userLoading) {
    return (
      <div className="profile profile--centered">
        <p>{t("profile.loading")}</p>
      </div>
    );
  }

  if (userError || !user) {
    return (
      <div className="profile profile--centered">
        <p className="profile__error">{t("profile.userError")}</p>
      </div>
    );
  }

  const total = games?.total ?? 0;
  const from = total === 0 ? 0 : offset + 1;
  const to = Math.min(offset + DEFAULT_LIMIT, total);
  const canPrev = offset > 0;
  const canNext = offset + DEFAULT_LIMIT < total;

  return (
    <motion.section className="profile" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <header className="profile__identity">
        <Avatar username={user.username} size="lg" />
        <div className="profile__identity-text">
          <h1 className="profile__username">{user.username}</h1>
          <p className="profile__email">{user.email ?? t("profile.noEmail")}</p>
          <p className="profile__since">{t("profile.memberSince", { date: formatDate(user.createdAt, language) })}</p>
        </div>
      </header>

      <section className="profile__stats" aria-label={t("profile.history")}>
        <div className="profile__stat">
          <span className="profile__stat-label">{t("profile.stats.rating")}</span>
          <span className="profile__stat-value">{user.rating}</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-label">{t("profile.stats.gamesPlayed")}</span>
          <span className="profile__stat-value">{user.gamesPlayed}</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-label">{t("profile.stats.wins")}</span>
          <span className="profile__stat-value profile__stat-value--up">{user.wins}</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-label">{t("profile.stats.losses")}</span>
          <span className="profile__stat-value profile__stat-value--down">{user.losses}</span>
        </div>
        <div className="profile__stat">
          <span className="profile__stat-label">{t("profile.stats.winrate")}</span>
          <span className="profile__stat-value">{winrate}</span>
        </div>
      </section>

      <section className="profile__history">
        <h2 className="profile__history-title">{t("profile.history")}</h2>

        {gamesLoading ? <p className="profile__hint">{t("profile.loading")}</p> : null}

        {gamesError ? <p className="profile__error">{t("profile.gamesError")}</p> : null}

        {!gamesLoading && !gamesError && total === 0 ? <p className="profile__hint">{t("profile.noGames")}</p> : null}

        {!gamesError && total > 0 ? (
          <>
            <ul className={`profile__games${gamesFetching ? " profile__games--fetching" : ""}`}>
              {games?.items.map((item: GameListItem) => {
                const delta = item.participant.ratingEvent?.delta ?? 0;
                const teamClass = `profile__team profile__team--${item.participant.team.toLowerCase()}`;
                const resultClass = item.participant.won
                  ? "profile__result profile__result--won"
                  : "profile__result profile__result--lost";
                return (
                  <li className="profile__game" key={item.game.id}>
                    <div className="profile__game-left">
                      <span className="profile__seat">#{item.participant.seatNumber}</span>
                      <span className={teamClass}>{t(`profile.role.${item.participant.role}`)}</span>
                      <span className="profile__life">{t(`profile.lifeStatus.${item.participant.lifeStatus}`)}</span>
                    </div>
                    <div className="profile__game-middle">
                      <span className={resultClass}>
                        {item.participant.won ? t("profile.result.won") : t("profile.result.lost")}
                      </span>
                    </div>
                    <div className="profile__game-right">
                      <span className={deltaClass(delta)}>
                        {item.participant.ratingEvent ? formatRatingDelta(delta) : "—"}
                      </span>
                      <span className="profile__date">{formatDateTime(item.game.finishedAt, language)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="profile__pagination">
              <button
                type="button"
                className={`button button--outline${canPrev ? "" : " disabled"}`}
                onClick={() => setOffset((value) => Math.max(0, value - DEFAULT_LIMIT))}
                disabled={!canPrev || gamesFetching}
              >
                {t("profile.prev")}
              </button>
              <span className="profile__page-info">{t("profile.pageInfo", { from, to, total })}</span>
              <button
                type="button"
                className={`button button--outline${canNext ? "" : " disabled"}`}
                onClick={() => setOffset((value) => value + DEFAULT_LIMIT)}
                disabled={!canNext || gamesFetching}
              >
                {t("profile.next")}
              </button>
            </div>
          </>
        ) : null}
      </section>
    </motion.section>
  );
};

export default ProfilePage;
