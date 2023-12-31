import { FC, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";
import DescriptionParagraph from "../../components/DescriptionParagraph";

import { database, IDatabaseDescription } from "../../assets/database";
import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation";

const MainPage: FC = () => {
  const location = useLocation();

  const [description, setDescription] = useState<IDatabaseDescription>(
    {} as IDatabaseDescription,
  );

  useEffect(() => {
    document.title = "Мафия | Рандомизатор ролей";

    const currentLocation = location.pathname.split("/")[1];

    const description: IDatabaseDescription = database.descriptions.find(
      (d) => d.path === currentLocation,
    )!;
    setDescription(description);
  }, [location]);

  return (
    <motion.div
      className="container__mainpage"
      initial={pagesInitial}
      animate={pagesAnimate}
      transition={pagesTransition}
    >
      <div className="flex-center-column">
        <Title text="Мафия (рандомизатор ролей)" />
        <DescriptionParagraph
          descriptionText={description.text}
          descriptionStrong={description.title}
        />
        <div className="flex-row-wrapper">
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
    </motion.div>
  );
};

export default MainPage;
