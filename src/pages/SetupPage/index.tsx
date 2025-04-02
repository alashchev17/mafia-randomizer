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
import { useTranslation } from "react-i18next";

interface SetupPageProps {
  settings: ISettings;
}

const SetupPage: FC<SetupPageProps> = ({ settings }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setupId } = useParams();

  useEffect(() => {
    document.title = t("titles.setupPage");
    setupId !== "1" ? navigate("/setup/1") : null; // проверяем на айдишник игрока при загрузке страницы setup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t]);

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
