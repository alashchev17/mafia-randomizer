import { FC, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import Avatar from "../Avatar";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsAuthenticated } from "../../store/authSlice";
import { useLogoutMutation, useMeQuery } from "../../store/api/authApi";

import checkSvg from "./assets/check.svg";
import chevronSvg from "./assets/chevron.svg";

const LANGUAGES = [
  { code: "en", native: "English" },
  { code: "ru", native: "Русский" },
];

const HeaderMenu: FC = () => {
  const { t } = useTranslation();
  const { language, changeLanguage } = useLanguage();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();
  const { data: user } = useMeQuery(undefined, { skip: !isAuthenticated });
  const [open, setOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const currentLanguage = LANGUAGES.find((l) => l.code === language) ?? LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setLangOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setLangOpen(false);
  };

  return (
    <div className="header-menu" ref={ref}>
      <button
        type="button"
        className="header-menu__trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("buttons.menu")}
      >
        {isAuthenticated && user ? (
          <Avatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
        ) : (
          <span className="header-menu__dots">⋯</span>
        )}
        <img className={`header-menu__caret${open ? " header-menu__caret--open" : ""}`} src={chevronSvg} alt="" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="header-menu__panel"
            role="menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
          >
            {isAuthenticated && user ? (
              <div className="header-menu__user">
                <Avatar username={user.username} avatarUrl={user.avatarUrl} size="sm" />
                <span className="header-menu__username">{user.username}</span>
              </div>
            ) : null}

            {isAuthenticated ? (
              <Link className="header-menu__item" to="/profile" onClick={close}>
                {t("buttons.profile")}
              </Link>
            ) : null}

            <Link className="header-menu__item" to="/settings" onClick={close}>
              {t("buttons.settings")}
            </Link>

            <button
              type="button"
              className="header-menu__item header-menu__lang-toggle"
              onClick={() => setLangOpen((o) => !o)}
            >
              <span>{t("buttons.language")}</span>
              <span className="header-menu__lang-current">
                {currentLanguage.native}
                <img
                  className={`header-menu__caret${langOpen ? " header-menu__caret--open" : ""}`}
                  src={chevronSvg}
                  alt=""
                />
              </span>
            </button>
            {langOpen ? (
              <div className="header-menu__lang-list">
                {LANGUAGES.map((lng) => (
                  <button
                    key={lng.code}
                    type="button"
                    className={`header-menu__lang-option${
                      language === lng.code ? " header-menu__lang-option--active" : ""
                    }`}
                    onClick={() => {
                      changeLanguage(lng.code);
                      close();
                    }}
                  >
                    {lng.native}
                    {language === lng.code ? <img className="header-menu__check" src={checkSvg} alt="" /> : null}
                  </button>
                ))}
              </div>
            ) : null}

            {isAuthenticated ? (
              <button
                type="button"
                className="header-menu__item header-menu__item--danger"
                onClick={() => {
                  close();
                  if (!isLoggingOut) void logout();
                }}
              >
                {t("buttons.logout")}
              </button>
            ) : (
              <Link className="header-menu__item" to="/login" onClick={close}>
                {t("buttons.login")}
              </Link>
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default HeaderMenu;
