import { FC, FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useJoinRoomMutation } from "../../store/api/roomsApi";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";

import "../AuthPage/index.scss";

const MultiplayerJoinPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [joinRoom, { isLoading, error }] = useJoinRoomMutation();

  useEffect(() => {
    document.title = t("titles.multiplayerJoin");
  }, [t]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(code)) return;
    try {
      const room = await joinRoom({ code }).unwrap();
      navigate(`/multiplayer/room/${room.id}`);
    } catch {
      // error shown inline
    }
  };

  return (
    <motion.section className="auth" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <div className="auth__card">
        <h1 className="auth__title">{t("multiplayer.join.title")}</h1>
        <p className="auth__subtitle">{t("multiplayer.join.subtitle")}</p>
        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <label className="auth__field">
            <span className="auth__label">{t("multiplayer.join.codeLabel")}</span>
            <input
              className="auth__input"
              type="text"
              inputMode="numeric"
              pattern="\d{6}"
              maxLength={6}
              autoComplete="off"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </label>
          {error ? <p className="auth__error">{error.message}</p> : null}
          <button
            type="submit"
            className={`auth__submit${isLoading || code.length !== 6 ? " disabled" : ""}`}
            disabled={isLoading || code.length !== 6}
          >
            <span>{t("multiplayer.join.submit")}</span>
            <span className="auth__submit__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </form>
      </div>
    </motion.section>
  );
};

export default MultiplayerJoinPage;
