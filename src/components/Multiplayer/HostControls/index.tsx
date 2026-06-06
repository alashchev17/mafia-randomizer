import { FC } from "react";
import { useTranslation } from "react-i18next";

import "./index.scss";

interface Props {
  onAdvance: () => void;
  onFinish: () => void;
}

const HostControls: FC<Props> = ({ onAdvance, onFinish }) => {
  const { t } = useTranslation();
  return (
    <div className="host-controls">
      <button type="button" className="button button--primary host-controls__advance" onClick={onAdvance}>
        {t("multiplayer.game.advancePhase")}
      </button>
      <button type="button" className="button button--third" onClick={onFinish}>
        {t("multiplayer.game.finishGame")}
      </button>
    </div>
  );
};

export default HostControls;
