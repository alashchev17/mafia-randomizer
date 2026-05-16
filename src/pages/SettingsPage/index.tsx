import { Dispatch, FC, FormEventHandler, SetStateAction, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";
import NumberInput from "../../components/NumberInput";

import "./index.scss";

import { ISettings } from "../../models";
import { pagesAnimate, pagesInitial, pagesTransition } from "../../utils/pagesAnimation.ts";
import {
  GAME_MODE_CLASSIC,
  GAME_MODE_EXTENDED,
  getRoleDistribution,
  normalizeGameMode,
  type GameMode,
} from "../../utils/roleDistribution.ts";
import { useTranslation } from "react-i18next";

interface SettingsPageProps {
  settings: ISettings;
  setSettings: Dispatch<SetStateAction<ISettings>>;
  handleNotification: (state: boolean, text: string) => void;
}

const PLAYER_COUNT_MIN = 4;
const PLAYER_COUNT_MAX = 12;

const GAME_MODES: {
  value: GameMode;
  titleKey: string;
  descriptionKey: string;
}[] = [
  {
    value: GAME_MODE_CLASSIC,
    titleKey: "gameModes.1.title",
    descriptionKey: "gameModes.1.shortDescription",
  },
  {
    value: GAME_MODE_EXTENDED,
    titleKey: "gameModes.2.title",
    descriptionKey: "gameModes.2.shortDescription",
  },
];

const SettingsPage: FC<SettingsPageProps> = ({ settings, setSettings, handleNotification }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [selectedPlayersAmount, setSelectedPlayersAmount] = useState(settings.amountOfPlayers);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(normalizeGameMode(settings.gameMode));
  const selectedGameModeLabel = t(
    GAME_MODES.find(({ value }) => value === selectedGameMode)?.titleKey || GAME_MODES[0].titleKey
  );
  const rolePreview = useMemo(
    () => getRoleDistribution(selectedPlayersAmount, selectedGameMode).filter(({ count }) => count > 0),
    [selectedPlayersAmount, selectedGameMode]
  );

  useEffect(() => {
    document.title = t("titles.settingsPage");
  }, [t]);

  useEffect(() => {
    setSelectedPlayersAmount(settings.amountOfPlayers);
    setSelectedGameMode(normalizeGameMode(settings.gameMode));
  }, [settings.amountOfPlayers, settings.gameMode]);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (selectedPlayersAmount >= PLAYER_COUNT_MIN && selectedPlayersAmount <= PLAYER_COUNT_MAX) {
      handleNotification(true, t("notifications.settingsSaved"));
      setSettings((prev: ISettings): ISettings => {
        return {
          ...prev,
          amountOfPlayers: selectedPlayersAmount,
          gameMode: selectedGameMode,
        };
      });
      navigate("/");
    } else {
      handleNotification(true, t("notifications.invalidPlayerCount"));
    }
  };

  return (
    <motion.div className="settings" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <div className="settings__header">
        <Title className="settings__title" text={t("headers.settings")} />
        <p className="settings__description">{t("descriptions.settings")}</p>
      </div>
      <form className="settings__form" onSubmit={handleSubmit}>
        <div className="settings__controls">
          <NumberInput
            label={t("labels.amountOfPlayers")}
            sublabel={t("labels.amountOfPlayersRange")}
            entityTitle={t("labels.playersEntity")}
            name="players"
            currentValue={selectedPlayersAmount}
            minValue={PLAYER_COUNT_MIN}
            maxValue={PLAYER_COUNT_MAX}
            onChange={setSelectedPlayersAmount}
          />
          <fieldset className="settings__mode">
            <legend className="settings__section-title">{t("labels.gameMode")}</legend>
            <div className="settings__mode-options">
              {GAME_MODES.map(({ value, titleKey, descriptionKey }) => (
                <label className="settings__mode-option" key={value}>
                  <input
                    className="settings__mode-input"
                    type="radio"
                    name="gameMode"
                    value={value}
                    checked={selectedGameMode === value}
                    onChange={() => setSelectedGameMode(value)}
                  />
                  <span className="settings__mode-card">
                    <span className="settings__mode-title">{t(titleKey)}</span>
                    <span className="settings__mode-description">{t(descriptionKey)}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
          <button className="button button--primary" type="submit">
            {t("buttons.saveChanges")}
          </button>
        </div>
        <aside className="settings__preview" aria-label={t("labels.rolePreview")}>
          <p className="settings__preview-label">{t("labels.rolePreview")}</p>
          <h2 className="settings__preview-title">
            {selectedPlayersAmount} {t("labels.playersEntity")}
          </h2>
          <p className="settings__preview-mode">
            {t("labels.gameModePreview")}: {selectedGameModeLabel}
          </p>
          <ul className="settings__preview-list">
            {rolePreview.map(({ titleKey, count }) => (
              <li className="settings__preview-item" key={titleKey}>
                <span className="settings__preview-role">{t(titleKey)}</span>
                <span className="settings__preview-count">× {count}</span>
              </li>
            ))}
          </ul>
        </aside>
      </form>
    </motion.div>
  );
};

export default SettingsPage;
