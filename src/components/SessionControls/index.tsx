import { FC } from "react";
import Button from "../Button";
import { AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { selectIsVotingPanelOpen, selectQueue, toggleVotingPanel } from "../../store/sessionSlice";
import { selectIsDay } from "../../store/statsSlice";
import { advanceCycleThunk, endGamePrematurelyThunk } from "../../store/thunks";

const SessionControls: FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const isDay = useAppSelector(selectIsDay);
  const isVotingPanelOpen = useAppSelector(selectIsVotingPanelOpen);
  const queueLength = useAppSelector((s) => selectQueue(s).length);

  const handleGameOver = () => {
    if (window.confirm(t("notifications.confirmPrematureFinish"))) {
      dispatch(endGamePrematurelyThunk());
    }
  };

  return (
    <div className="session__controls">
      <Button
        className={isDay ? "button--third" : "button--primary"}
        text={isDay ? t("buttons.nextNight") : t("buttons.nextDay")}
        clickHandle={() => dispatch(advanceCycleThunk())}
        disabled={isVotingPanelOpen}
      />
      <AnimatePresence>
        {isDay && (
          <Button
            className="button--primary"
            text={isVotingPanelOpen ? t("buttons.hideVoting") : t("buttons.showVoting")}
            clickHandle={() => dispatch(toggleVotingPanel())}
            disabled={queueLength < 1}
          />
        )}
      </AnimatePresence>
      <Button className="button--secondary" text={t("buttons.finishGame")} clickHandle={handleGameOver} />
    </div>
  );
};

export default SessionControls;
