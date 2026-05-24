import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./index.scss";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsAuthenticated } from "../../store/authSlice";
import { useLogoutMutation } from "../../store/api/authApi";

const Header: FC = () => {
  const { t } = useTranslation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const [logout, { isLoading: isLoggingOut }] = useLogoutMutation();

  const onLogout = () => {
    if (isLoggingOut) return;
    void logout();
  };

  const headerVariants = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  };

  return (
    <motion.header
      className="header"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.3,
        delay: 0.25,
      }}
      exit="hidden"
    >
      <Link className="header__logo" to={"/welcome"} replace={true}>
        {t("headers.mainHeader")}
      </Link>
      <div className="header__actions">
        <Link className="button button--secondary" to={"/settings"}>
          {t("buttons.settings")}
        </Link>
        {isAuthenticated ? (
          <button
            type="button"
            className={`button button--outline${isLoggingOut ? " disabled" : ""}`}
            onClick={onLogout}
            disabled={isLoggingOut}
          >
            {t("buttons.logout")}
          </button>
        ) : (
          <Link className="button button--outline" to={"/login"}>
            {t("buttons.login")}
          </Link>
        )}
        <LanguageSwitcher />
      </div>
    </motion.header>
  );
};

export default Header;
