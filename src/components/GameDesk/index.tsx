import { FC } from "react";

import Title from "../Title";
import { IPlayers } from "../../utils/rolesRandomizer.ts";

import "./index.scss";

interface GameDeskProps {
  players: IPlayers[];
}

const GameDesk: FC<GameDeskProps> = ({ players }) => {
  return (
    <div className="game-desk">
      <Title text="Игровое поле" />
      <div className={`game-desk__cards game-desk__cards--${players.length}`}>
        className: {`game-desk__cards--${players.length}`}
      </div>
    </div>
  );
};

export default GameDesk;
