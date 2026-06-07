import { FC, FormEvent, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useLoginMutation } from "../../store/api/authApi";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsAuthenticated } from "../../store/authSlice";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation";

import "../AuthPage/index.scss";

const LoginPage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading, error }] = useLoginMutation();

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/welcome";

  useEffect(() => {
    document.title = t("titles.loginPage");
  }, [t]);

  useEffect(() => {
    if (isAuthenticated) navigate(redirectTo, { replace: true });
  }, [isAuthenticated, navigate, redirectTo]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void login({ email, password });
  };

  return (
    <motion.section className="auth" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <div className="auth__card">
        <h1 className="auth__title">{t("auth.loginTitle")}</h1>
        <p className="auth__subtitle">{t("auth.loginSubtitle")}</p>

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
            <span className="auth__label">{t("labels.password")}</span>
            <input
              className="auth__input"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>

          {error ? <p className="auth__error">{error.message}</p> : null}

          <button type="submit" className={`auth__submit${isLoading ? " disabled" : ""}`} disabled={isLoading}>
            <span>{isLoading ? t("buttons.signingIn") : t("buttons.login")}</span>
            <span className="auth__submit__arrow" aria-hidden="true">
              →
            </span>
          </button>
        </form>
      </div>

      <p className="auth__footer">
        {t("auth.noAccount")}
        <Link className="auth__link" to="/register">
          {t("buttons.register")}
        </Link>
      </p>
    </motion.section>
  );
};

export default LoginPage;
