import { FC, useEffect, useState } from "react";

import { IPlayer } from "../../../models";

import "./index.scss";

interface PlayerCardFrontsideProps {
  isRevealed: boolean;
  currentPlayer: IPlayer;
}

const PlayerCardFrontside: FC<PlayerCardFrontsideProps> = ({ isRevealed, currentPlayer }) => {
  const { roleSrc, role } = currentPlayer;

  const [image, setImage] = useState(roleSrc);

  useEffect(() => {
    setTimeout(() => {
      setImage(roleSrc);
    }, 2000);
  }, [roleSrc]);

  const classes = `frontside ${isRevealed ? "" : "active"}`;

  return <img className={classes} src={image} alt={role} />;
};

export default PlayerCardFrontside;
