import { FC, FormEvent, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useRegisterMutation } from "../../store/api/authApi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsAuthenticated } from "../../store/authSlice";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";

import "../AuthPage/index.scss";

const RegisterPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [register, { isLoading, error }] = useRegisterMutation();

  useEffect(() => {
    document.title = t("titles.registerPage");
  }, [t]);

  useEffect(() => {
    if (isAuthenticated) navigate("/welcome", { replace: true });
  }, [isAuthenticated, navigate]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void register({ email, username, password });
  };

  return (
    <motion.section className="auth" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <div className="auth__card">
        <h1 className="auth__title">{t("auth.registerTitle")}</h1>
        <p className="auth__subtitle">{t("auth.registerSubtitle")}</p>

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <label className="auth__field">
            <span className="auth__label">{t("labels.email")}</span>
            <input
              className="auth__input"
              type="email"
              name="email"
              autoComplete="email"
              required
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="auth__field">
            <span className="auth__label">{t("labels.username")}</span>
            <input
              className="auth__input"
              type="text"
              name="username"
              autoComplete="username"
              required
              minLength={3}
              maxLength={24}
              spellCheck={false}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </label>

          <label className="auth__field">
            <span className="auth__label">{t("labels.password")}</span>
            <input
              className="auth__input"
              type="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p className="auth__error">{error.message}</p> : null}

          <button type="submit" className={`auth__submit${isLoading ? " disabled" : ""}`} disabled={isLoading}>
            <span>{isLoading ? t("buttons.creatingAccount") : t("buttons.register")}</span>
            <span className="auth__submit__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </form>
      </div>

      <p className="auth__footer">
        {t("auth.haveAccount")}
        <Link className="auth__link" to="/login">
          {t("buttons.login")}
        </Link>
      </p>
    </motion.section>
  );
};

export default RegisterPage;
