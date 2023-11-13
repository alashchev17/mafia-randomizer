import { FC, useEffect, useState, MouseEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

import Title from "../components/Title";
import PlayerCard from "../components/PlayerCard";
import {
  IPlayers,
  rolesRandomizer,
  initialPlayers,
} from "../utils/rolesRandomizer";

const SetupPage: FC = () => {
  const navigate = useNavigate();
  const locationOnLoad = document.location.href.split("/")[4];
  // @ts-ignore
  const [playersAmount, setPlayersAmount] = useState(6);

  const [players, setPlayers] = useState(initialPlayers as IPlayers[]);
  const [playerId, setPlayerId] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);

  const playerCount = playerId + 1;

  const linkHandler = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!isRevealed || isRevealing) {
      event.preventDefault();
      return;
    }
    setPlayerId((prev) => prev + 1);
    setIsRevealing(true);
    setTimeout(() => {
      setIsRevealing(false);
    }, 2000);
  };

  useEffect(() => {
    document.title = "Мафия | Игровая сессия";
    locationOnLoad !== "1" ? navigate("/setup/1") : null; // проверяем на айдишник игрока при загрузке страницы setup
    setPlayers(rolesRandomizer(playersAmount));
  }, []);

  useEffect(() => {
    setIsRevealed(false);
  }, [playerId]);

  useEffect(() => {
    setTimeout(() => {
      setIsRevealing(false);
    }, 1500);
  }, [players]);

  return (
    <div className="flex-center-column">
      <Title text={`Игрок №${playerCount}`} />
      <PlayerCard
        isRevealed={isRevealed}
        setIsRevealed={setIsRevealed}
        isRevealing={isRevealing}
        setIsRevealing={setIsRevealing}
        currentPlayer={players[playerId]}
      />
      <div className="flex-column-wrapper">
        {playersAmount !== playerCount && (
          <Link
            to={`/setup/${playerCount + 1}`}
            className={`button button--primary ${
              isRevealing || !isRevealed ? "disabled" : ""
            }`}
            onClick={linkHandler}
          >
            Следующий игрок
          </Link>
        )}
        <Link to={"/welcome"} className="button button--secondary">
          Выйти
        </Link>
      </div>
    </div>
  );
};

export default SetupPage;
