import { FC, MouseEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Title from "../../components/Title";
import PlayerCard from "../../components/PlayerCard";

import {
  initialPlayers,
  rolesRandomizer,
} from "../../utils/rolesRandomizer.ts";
import { ISettings, IPlayer } from "../../models";
import { useTranslation } from "react-i18next";

interface SetupContentProps {
  settings: ISettings;
}

const SetupContent: FC<SetupContentProps> = ({ settings }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setupId } = useParams();

  const [players, setPlayers] = useState(initialPlayers as IPlayer[]);
  const [playerId, setPlayerId] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isRevealing, setIsRevealing] = useState(true);
  const { mafiaPlayers, innocentPlayers, generatedArray } = rolesRandomizer(
    settings.amountOfPlayers,
    settings.gameMode,
  );

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
    document.title = t("titles.setupPage");
    setupId !== "1" ? navigate("/setup/1") : null; // проверяем на айдишник игрока при загрузке страницы setup

    setPlayers(generatedArray);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

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
      <Title text={`${t("labels.player")} №${playerCount}`} />
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
            className={`button button--primary ${isRevealing || !isRevealed ? "disabled" : ""}`}
            onClick={linkHandler}
          >
            {t("buttons.nextPlayer")}
          </Link>
        ) : (
          <Link
            to="/session"
            state={{ players, innocentPlayers, mafiaPlayers }}
            className={`button button--primary ${isRevealing || !isRevealed ? "disabled" : ""}`}
            onClick={(event) =>
              !isRevealed || isRevealing ? event.preventDefault() : null
            }
          >
            {t("buttons.goToGameDesk")}
          </Link>
        )}
      </div>
    </>
  );
};

export { SetupContent };
