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

interface SettingsPageProps {
  settings: ISettings;
  setSettings: Dispatch<SetStateAction<ISettings>>;
}

type FormFields = {
  players: HTMLInputElement;
  gameMode: HTMLInputElement;
};

const SettingsPage: FC<SettingsPageProps> = ({ settings, setSettings }) => {
  const navigate = useNavigate();

  const [isValid, setIsValid] = useState(true);
  const handleSubmit: FormEventHandler<HTMLFormElement & FormFields> = (
    event,
  ) => {
    event.preventDefault();
    const form = event.currentTarget;

    const amountOfPlayers = Number(form.players.value);
    const gameMode = form.gameMode.value;

    setSettings((prev: ISettings): ISettings => {
      return {
        ...prev,
        amountOfPlayers,
        gameMode,
      };
    });
    // alert("Вы сохранили настройки!");
    navigate("/");
  };

  const buttonClassNames = `button button--primary ${
    isValid ? "" : "disabled"
  }`;

  return (
    <motion.div
      className="flex-center-column settings"
      initial={{
        opacity: 0,
        y: -50,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        delay: 0.3,
        duration: 0.8,
        type: "spring",
      }}
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
            <select name="gameMode">
              <option value="Выберите режим" disabled>
                Выберите режим
              </option>
              {database.gameModes.map((item) => {
                if (item.title === settings.gameMode) {
                  return (
                    <option value={item.title} selected>
                      {item.title}
                    </option>
                  );
                }
                return <option value={item.title}>{item.title}</option>;
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
