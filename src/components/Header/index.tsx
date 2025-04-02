import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./index.scss";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher/LanguageSwitcher";

const Header: FC = () => {
  const { t } = useTranslation();

  const headerVariants = {
    visible: {
      // height: "auto",
      opacity: 1,
    },
    hidden: {
      // height: 0,
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
      <div
        style={{
          display: "flex",
          gap: "24px",
          alignItems: "center",
        }}
      >
        <Link className="button button--secondary" to={"/settings"}>
          {t("buttons.settings")}
        </Link>
        <LanguageSwitcher />
      </div>
    </motion.header>
  );
};

export default Header;
