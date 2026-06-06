import { FC } from "react";
import { useTranslation } from "react-i18next";

import type { CheckResult } from "../../../store/multiplayerSlice";
import { checkVerdict } from "../../../utils/checkVerdict";

import "./index.scss";

interface Props {
  results: CheckResult[];
  currentCycle: number;
}

const CheckResults: FC<Props> = ({ results, currentCycle }) => {
  const { t } = useTranslation();
  const recent = results.filter((r) => r.cycle <= currentCycle).slice(-6);

  return (
    <div className="check-results">
      <span className="check-results__title">{t("multiplayer.game.checkResultTitle")}</span>
      <div className="check-results__tags">
        {recent.length === 0 ? (
          <span className="check-results__empty">{t("multiplayer.game.checkResultEmpty")}</span>
        ) : (
          recent.map((r) => {
            const { key, tone } = checkVerdict(r.result);
            return (
              <span key={`${r.cycle}-${r.targetSeat}`} className="check-results__tag">
                <span className="check-results__seat">#{r.targetSeat}</span>
                <span className={`check-results__verdict check-results__verdict--${tone}`}>
                  {t(`multiplayer.log.${key}`)}
                </span>
              </span>
            );
          })
        )}
      </div>
    </div>
  );
};

export default CheckResults;
