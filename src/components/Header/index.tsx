import { FC } from "react";
import { Link } from "react-router-dom";

import "./index.scss";

const Header: FC = () => {
  return (
    <header className="header">
      <Link className="header__logo" to={"/welcome"}>
        Mafia (roles randomizer)
      </Link>
      <Link className="button button--secondary" to={"/settings"}>
        Настройки
      </Link>
    </header>
  );
};

export default Header;
