import type { CheckResult } from "../store/multiplayerSlice";

export interface CheckVerdict {
  /** i18n key suffix under `multiplayer.log.*`. */
  key: "checkMafia" | "checkCitizen" | "checkSheriff" | "checkNotSheriff";
  tone: "mafia" | "citizen" | "sheriff" | "none";
}

/**
 * Maps a check result to its verdict label key and tone. Don/Sheriff checks
 * report `isMafia`; Sheriff-search checks report `isSheriff`. Shared by the
 * private CheckResults panel and the host game log so the two never diverge.
 */
export const checkVerdict = (result: CheckResult["result"]): CheckVerdict => {
  if (result.isMafia !== undefined) {
    return result.isMafia ? { key: "checkMafia", tone: "mafia" } : { key: "checkCitizen", tone: "citizen" };
  }
  return result.isSheriff ? { key: "checkSheriff", tone: "sheriff" } : { key: "checkNotSheriff", tone: "none" };
};
