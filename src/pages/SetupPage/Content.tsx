import { FC, MouseEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Title from "../../components/Title";
import PlayerCard from "../../components/PlayerCard";

import {
  initialPlayers,
  IPlayers,
  rolesRandomizer,
} from "../../utils/rolesRandomizer.ts";

const SetupContent: FC = () => {
  const navigate = useNavigate();
  const { setupId } = useParams();

  const [playersAmount, setPlayersAmount] = useState(10);

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
    const introducedAmountOfPlayers = window.prompt(
      "Введите количество игроков (число):",
    );
    if (
      !isNaN(Number(introducedAmountOfPlayers)) &&
      introducedAmountOfPlayers !== null &&
      introducedAmountOfPlayers.length !== 0
    ) {
      setPlayersAmount(Number(introducedAmountOfPlayers));
      setPlayers(rolesRandomizer(playersAmount));
    } else {
      alert("Вы ввели некорректное значение!");
      navigate("/welcome");
    }
  }, []);

  useEffect(() => {
    setPlayers(rolesRandomizer(playersAmount));
  }, [playersAmount]);

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
    </>
  );
};

export { SetupContent };
