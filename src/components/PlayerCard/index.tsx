import { FC } from "react";

import { IPlayers } from "../../utils/rolesRandomizer";

import PlayerCardBackside from "./PlayerCardBackside";
import PlayerCardFrontside from "./PlayerCardFrontside";

import "./index.scss";

interface PlayerCardProps {
  isRevealed: boolean;
  setIsRevealed: (state: boolean) => void;
  isRevealing: boolean;
  setIsRevealing: (state: boolean) => void;
  currentPlayer: IPlayers;
}

const PlayerCard: FC<PlayerCardProps> = (props: PlayerCardProps) => {
  const {
    currentPlayer,
    isRevealed,
    isRevealing,
    setIsRevealed,
    setIsRevealing,
  } = props;

  const roleRevealHandler = () => {
    if (!isRevealed && !isRevealing) {
      setIsRevealing(true);
      setIsRevealed(true);
      setTimeout(() => {
        setIsRevealing(false);
      }, 2000);
    }
  };
  const classes = `player-card ${isRevealing ? "disabled" : ""}`;
  return (
    <div className={classes} onClick={roleRevealHandler}>
      <PlayerCardBackside isRevealed={isRevealed} />
      <PlayerCardFrontside
        isRevealed={isRevealed}
        currentPlayer={currentPlayer}
      />
    </div>
  );
};

export default PlayerCard;
