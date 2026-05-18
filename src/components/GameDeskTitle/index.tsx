import { FC, useMemo } from "react";
import Title from "../Title";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectCycle, selectIsDay, selectIsNight } from "../../store/statsSlice";

const GameDeskTitle: FC = () => {
  const isDay = useAppSelector(selectIsDay);
  const isNight = useAppSelector(selectIsNight);
  const counter = useAppSelector(selectCycle);
  const { t } = useTranslation();

  const title = useMemo(() => {
    if (isDay) return `${t("labels.day")} - ${counter}`;
    if (isNight) return `${t("labels.night")} - ${counter}`;
    return "";
  }, [isDay, isNight, counter, t]);

  return <Title text={title} />;
};

export default GameDeskTitle;
