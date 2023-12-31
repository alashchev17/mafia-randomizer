import { FC } from "react";

import "./index.scss";
import backsideSvg from "./backside.svg";

interface PlayerCardBacksideProps {
  isRevealed: boolean;
}

const PlayerCardBackside: FC<PlayerCardBacksideProps> = ({ isRevealed }) => {
  const classes = `backside ${isRevealed ? "active" : ""}`;

  return <img className={classes} src={backsideSvg} alt="Backside Card" />;
};

export default PlayerCardBackside;
