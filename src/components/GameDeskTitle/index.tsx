import { FC } from "react";
import Title from "../Title";
import { useSessionContext } from "../../contexts/SessionContext.tsx";
import { useTranslation } from "react-i18next";

const GameDeskTitle: FC = () => {
  const { gameStats } = useSessionContext();
  const { t } = useTranslation();
  return <Title text={`${gameStats.type === "День" ? t("labels.day") : t("labels.night")} – ${gameStats.counter}`} />;
};

export default GameDeskTitle;
