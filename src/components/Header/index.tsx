import { FC } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import "./index.scss";

const Header: FC = () => {
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
        Mafia (roles randomizer)
      </Link>
      <Link className="button button--secondary" to={"/settings"}>
        Настройки
      </Link>
    </motion.header>
  );
};

export default Header;
