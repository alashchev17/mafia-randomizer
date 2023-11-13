import { FC, useEffect, useState } from "react";

import { IPlayers } from "../../../utils/rolesRandomizer";

import "./index.scss";

interface PlayerCardFrontsideProps {
  isRevealed: boolean;
  currentPlayer: IPlayers;
}

const PlayerCardFrontside: FC<PlayerCardFrontsideProps> = (
  props: PlayerCardFrontsideProps,
) => {
  const { isRevealed, currentPlayer } = props;
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
