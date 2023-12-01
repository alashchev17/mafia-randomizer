import {
  Dispatch,
  FC,
  FormEventHandler,
  SetStateAction,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Title from "../../components/Title";
import NumberInput from "../../components/NumberInput";

import "./index.scss";

import { database } from "../../assets/database.ts";
import { ISettings } from "../../models";
import {
  pagesAnimate,
  pagesInitial,
  pagesTransition,
} from "../../utils/pagesAnimation.ts";

interface SettingsPageProps {
  settings: ISettings;
  setSettings: Dispatch<SetStateAction<ISettings>>;
  handleNotification: (
    state: boolean,
    title: string,
    text: string,
    information: string,
  ) => void;
}

type FormFields = {
  players: HTMLInputElement;
  gameMode: HTMLInputElement;
};

const SettingsPage: FC<SettingsPageProps> = ({
  settings,
  setSettings,
  handleNotification,
}) => {
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState(true);
  const handleSubmit: FormEventHandler<HTMLFormElement & FormFields> = (
    event,
  ) => {
    event.preventDefault();
    if (isValid) {
      const form = event.currentTarget;

      const amountOfPlayers = Number(form.players.value);
      const gameMode = form.gameMode.value;
      if (amountOfPlayers >= 6 && amountOfPlayers <= 12) {
        handleNotification(
          true,
          "Уведомление",
          "Настройки были сохранены успешно!",
          `Игровой режим: ${gameMode}, кол-во игроков: ${amountOfPlayers}`,
        );
        setSettings((prev: ISettings): ISettings => {
          return {
            ...prev,
            amountOfPlayers,
            gameMode,
          };
        });
        navigate("/");
      } else {
        handleNotification(
          true,
          "Ошибка",
          "Указано некорректное количество игроков",
          `Ошибка: поле ввода формы было отредактировано вручную`,
        );
      }
    } else {
      handleNotification(
        true,
        "Ошибка",
        "В процессе сохранения настроек произошла ошибка!",
        `Ошибка: какой-то элемент формы был отредактирован вручную`,
      );
    }
  };

  const buttonClassNames = `button button--primary ${
    isValid ? "" : "disabled"
  }`;

  return (
    <motion.div
      className="flex-center-column settings"
      initial={pagesInitial}
      animate={pagesAnimate}
      transition={pagesTransition}
    >
      <Title text="Настройки" />
      <form className="settings__form" onSubmit={handleSubmit}>
        <NumberInput
          label="Количество игроков"
          name="players"
          currentValue={settings.amountOfPlayers}
          setButtonValid={setIsValid}
        />
        <label className="label">
          Игровой режим
          <div className="select-wrapper">
            <select name="gameMode" defaultValue={settings.gameMode}>
              <option value="Выберите режим" disabled>
                Выберите режим
              </option>
              {database.gameModes.map((item) => {
                if (item.title === settings.gameMode) {
                  return (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  );
                }
                return (
                  <option key={item.title} value={item.title}>
                    {item.title}
                  </option>
                );
              })}
            </select>
          </div>
        </label>
        <button className={buttonClassNames} disabled={!isValid} type="submit">
          Сохранить изменения
        </button>
      </form>
    </motion.div>
  );
};

export default SettingsPage;
