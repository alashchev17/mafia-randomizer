import { FC, MouseEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Title from "../../components/Title";
import PlayerCard from "../../components/PlayerCard";

import {
  initialPlayers,
  rolesRandomizer,
} from "../../utils/rolesRandomizer.ts";
import { ISettings, IPlayers } from "../../models";

interface SetupContentProps {
  settings: ISettings;
}

const SetupContent: FC<SetupContentProps> = ({ settings }) => {
  const navigate = useNavigate();
  const { setupId } = useParams();

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
    setupId !== "1" ? navigate("/setup/1") : null; // проверяем на айдишник игрока при загрузке страницы setup

    setPlayers(rolesRandomizer(settings.amountOfPlayers, settings.gameMode));

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      <Title text={`Игрок №${playerCount}`} />
      <PlayerCard
        isRevealed={isRevealed}
        setIsRevealed={setIsRevealed}
        isRevealing={isRevealing}
        setIsRevealing={setIsRevealing}
        currentPlayer={players[playerId]}
      />
      <div className="flex-column-wrapper">
        {settings.amountOfPlayers !== playerCount ? (
          <Link
            to={`/setup/${playerCount + 1}`}
            className={`button button--primary ${
              isRevealing || !isRevealed ? "disabled" : ""
            }`}
            onClick={linkHandler}
          >
            Следующий игрок
          </Link>
        ) : (
          <Link
            to="/session"
            state={{ players }}
            className={`button button--primary ${
              isRevealing || !isRevealed ? "disabled" : ""
            }`}
            onClick={(event) =>
              !isRevealed || isRevealing ? event.preventDefault() : null
            }
          >
            Перейти к игровому полю
          </Link>
        )}
      </div>
    </>
  );
};

export { SetupContent };
