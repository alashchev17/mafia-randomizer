import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Title from "../components/Title";
import DescriptionParagraph from "../components/DescriptionParagraph";

import { database, IDatabaseDescriptions } from "../assets/database";

const MainPage: FC = () => {
  const [description, setDescription] = useState<IDatabaseDescriptions>(
    {} as IDatabaseDescriptions,
  );

  useEffect(() => {
    document.title = "Мафия | Рандомизатор ролей";

    let currentLocation = "welcome";

    const description: IDatabaseDescriptions = database.descriptions.find(
      (d) => d.path === currentLocation,
    )!;
    setDescription(description);
  }, []);

  return (
    <div className="flex-center-column">
      <Title text="Мафия (рандомизатор ролей)" />
      <DescriptionParagraph
        descriptionText={description.text}
        descriptionStrong={description.title}
      />
      <div className="flew-row-wrapper">
        <Link to={"/setup/1"} className="button button--primary">
          Начать игру
        </Link>
        <Link to={"/information"} className="button button--secondary">
          Информация о ролях
        </Link>
        <a
          href="https://github.com/alashchev17/mafia-randomizer"
          target="_blank"
          className="button button--third"
        >
          Исходный код
        </a>
      </div>
    </div>
  );
};

export default MainPage;
