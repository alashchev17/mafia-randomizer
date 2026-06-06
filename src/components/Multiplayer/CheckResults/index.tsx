import { FC } from "react";
import { useTranslation } from "react-i18next";

import type { CheckResult } from "../../../store/multiplayerSlice";

import "./index.scss";

interface Props {
  results: CheckResult[];
  currentCycle: number;
}

const verdictFor = (result: CheckResult["result"]): { key: string; tone: string } => {
  if (result.isMafia !== undefined) {
    return result.isMafia ? { key: "checkMafia", tone: "mafia" } : { key: "checkCitizen", tone: "citizen" };
  }
  return result.isSheriff ? { key: "checkSheriff", tone: "sheriff" } : { key: "checkNotSheriff", tone: "none" };
};

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
          recent.map((r, idx) => {
            const { key, tone } = verdictFor(r.result);
            return (
              <span key={idx} className="check-results__tag">
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
