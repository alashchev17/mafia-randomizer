import { FC } from "react";

import Title from "../Title";
import GameDeskCard from "../GameDeskCard";

import "./index.scss";

import { IPlayers, IGameDeskPlayers } from "../../models";

interface GameDeskProps {
  players: IPlayers[];
}

const GameDesk: FC<GameDeskProps> = ({ players }) => {
  const listOfPlayers: IGameDeskPlayers[] = players.map(
    (player: IPlayers, index: number) => {
      return {
        id: index + 1,
        role: player.role,
        roleSrc: player.roleSrc,
      };
    },
  );

  return (
    <div className="game-desk">
      <Title text="Игровое поле" />
      <div className={`game-desk__cards game-desk__cards--${players.length}`}>
        {listOfPlayers.map((player) => (
          <GameDeskCard key={player.id} player={player} />
        ))}
      </div>
    </div>
  );
};

export default GameDesk;
