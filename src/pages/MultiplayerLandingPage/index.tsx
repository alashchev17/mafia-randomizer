import { FC, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";
import { useCreateRoomMutation } from "../../store/api/roomsApi";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectSettings } from "../../store/settingsSlice";
import { pushNotification } from "../../store/notificationSlice";
import { normalizeGameMode, GAME_MODE_EXTENDED } from "../../utils/roleDistribution";

import "./index.scss";

const MultiplayerLandingPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const settings = useAppSelector(selectSettings);
  const [createRoom, { isLoading }] = useCreateRoomMutation();

  useEffect(() => {
    document.title = t("titles.multiplayerLanding");
  }, [t]);

  const onCreate = async () => {
    try {
      const mode = normalizeGameMode(settings.gameMode);
      const room = await createRoom({
        maxPlayers: settings.amountOfPlayers,
        gameMode: mode === GAME_MODE_EXTENDED ? "EXTENDED" : "CLASSIC",
      }).unwrap();
      navigate(`/multiplayer/room/${room.id}`);
    } catch (err) {
      const message =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message: unknown }).message)
          : t("multiplayer.errors.general");
      dispatch(pushNotification(message));
    }
  };

  return (
    <motion.section className="mp-landing" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <header className="mp-landing__header">
        <h1 className="mp-landing__title">{t("multiplayer.landing.title")}</h1>
        <p className="mp-landing__subtitle">{t("multiplayer.landing.subtitle")}</p>
      </header>

      <div className="mp-landing__cards">
        <article className="mp-landing__card">
          <h2 className="mp-landing__card-title">{t("multiplayer.landing.createTitle")}</h2>
          <p className="mp-landing__card-desc">{t("multiplayer.landing.createDescription")}</p>
          <p className="mp-landing__settings">
            {settings.amountOfPlayers} · {settings.gameMode}{" "}
            <Link to="/settings" className="mp-landing__settings-link">
              {t("buttons.openSettings")}
            </Link>
          </p>
          <button
            type="button"
            className={`button button--primary${isLoading ? " disabled" : ""}`}
            onClick={onCreate}
            disabled={isLoading}
          >
            {t("buttons.createRoom")}
          </button>
        </article>

        <article className="mp-landing__card">
          <h2 className="mp-landing__card-title">{t("multiplayer.landing.joinTitle")}</h2>
          <p className="mp-landing__card-desc">{t("multiplayer.landing.joinDescription")}</p>
          <Link to="/multiplayer/join" className="button button--outline">
            {t("buttons.joinRoom")}
          </Link>
        </article>
      </div>
    </motion.section>
  );
};

export default MultiplayerLandingPage;
