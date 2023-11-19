import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";
import DescriptionParagraph from "../../components/DescriptionParagraph";

import { database, IDatabaseDescriptions } from "../../assets/database";

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
    <motion.div
      className="flex-center-column"
      initial={{
        y: -50,
        opacity: 0,
      }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        type: "spring",
      }}
    >
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
          href="https://github.com/alashchev17"
          target="_blank"
          className="button button--third"
        >
          Исходный код
        </a>
      </div>
    </motion.div>
  );
};

export default MainPage;
