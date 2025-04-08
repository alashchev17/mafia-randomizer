import { FC, useCallback, useEffect } from "react";

import { IPlayer } from "../../models";

import PlayerCardBackside from "./PlayerCardBackside";
import PlayerCardFrontside from "./PlayerCardFrontside";

import "./index.scss";

interface PlayerCardProps {
  isRevealed: boolean;
  setIsRevealed: (state: boolean) => void;
  isRevealing: boolean;
  setIsRevealing: (state: boolean) => void;
  currentPlayer: IPlayer;
}

const PlayerCard: FC<PlayerCardProps> = ({ currentPlayer, isRevealed, isRevealing, setIsRevealed, setIsRevealing }) => {
  const roleRevealHandler = useCallback(() => {
    if (!isRevealed && !isRevealing) {
      setIsRevealing(true);
      setIsRevealed(true);
      setTimeout(() => {
        setIsRevealing(false);
      }, 2000);
    }
  }, [isRevealed, isRevealing, setIsRevealing, setIsRevealed]);

  useEffect(() => {
    const handleSpacePress = (event: globalThis.KeyboardEvent) => {
      if (event.code === "Space") roleRevealHandler();
    };
    window.addEventListener("keypress", handleSpacePress);

    return () => {
      window.removeEventListener("keypress", handleSpacePress);
    };
  }, [roleRevealHandler]);

  const classes = `player-card ${isRevealing ? "disabled" : ""}`;

  return (
    <div className={classes} onClick={roleRevealHandler}>
      <PlayerCardBackside isRevealed={isRevealed} />
      <PlayerCardFrontside isRevealed={isRevealed} currentPlayer={currentPlayer} />
    </div>
  );
};

export default PlayerCard;
