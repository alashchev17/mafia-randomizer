import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import HeaderMenu from "./HeaderMenu";

import "./index.scss";

const headerVariants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0 },
};

const Header: FC = () => {
  const { t } = useTranslation();

  return (
    <motion.header
      className="header"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.3, delay: 0.25 }}
      exit="hidden"
    >
      <Link className="header__logo" to={"/welcome"} replace={true}>
        {t("headers.mainHeader")}
      </Link>
      <HeaderMenu />
    </motion.header>
  );
};

export default Header;
