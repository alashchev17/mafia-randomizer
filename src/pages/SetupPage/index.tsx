import { FC, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { SetupContent } from "./Content.tsx";

import { ISettings } from "../../models";
import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation.ts";

interface SetupPageProps {
  settings: ISettings;
}

const SetupPage: FC<SetupPageProps> = ({ settings }) => {
  const navigate = useNavigate();
  const { setupId } = useParams();

  useEffect(() => {
    document.title = "Мафия | Игровая сессия";
    setupId !== "1" ? navigate("/setup/1") : null; // проверяем на айдишник игрока при загрузке страницы setup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="flex-center-column"
      initial={pagesInitial}
      animate={pagesAnimate}
      transition={pagesTransition}
    >
      <SetupContent settings={settings} />
    </motion.div>
  );
};

export default SetupPage;
