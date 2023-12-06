import { FC, useCallback, useEffect, useState } from "react";

import Button from "../Button";

import "./index.scss";

interface TimerProps {
  handleNotification: (state: boolean, text: string) => void;
}

const Timer: FC<TimerProps> = ({ handleNotification }) => {
  const [initialSeconds, setInitialSeconds] = useState(60);
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const startTimer = () => {
    if (!isTimerActive) {
      setIsTimerActive((prev) => !prev);
    }
  };

  const handleTimer = useCallback(() => {
    if (isTimerActive) {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1);
      } else {
        setIsTimerActive((prev) => !prev);
        setSeconds(initialSeconds);
        handleNotification(true, "Таймер завершил свою работу успешно!");
      }
    }
  }, [seconds, isTimerActive, handleNotification, initialSeconds]);

  const skipTimer = () => {
    if (isTimerActive) {
      setIsTimerActive((prev) => !prev);
      setSeconds(initialSeconds);
      handleNotification(true, "Таймер был пропущен успешно!");
    }
  };

  const changeTimer = (amount: number) => {
    setInitialSeconds(amount);
    setSeconds(amount);
  };

  useEffect(() => {
    const interval = setInterval(handleTimer, 1000);
    return () => clearInterval(interval);
  }, [seconds, isTimerActive, handleTimer]);

  const timerSeconds =
    seconds === 60 ? "01:00" : `00:${seconds < 10 ? `0${seconds}` : seconds}`;

  return (
    <div className="timer">
      <div className="timer__clock">
        <span>{timerSeconds}</span>
        <svg
          width="35"
          height="45"
          viewBox="0 0 35 45"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`${isTimerActive ? "disabled" : ""}`}
        >
          <path
            onClick={startTimer}
            d="M0 22.5V0L35 22.5L0 45V22.5Z"
            fill="white"
          />
        </svg>
      </div>
      <div className="timer__controls">
        <Button
          className="button--primary"
          text="60 секунд"
          clickHandle={() => changeTimer(60)}
          disabled={isTimerActive}
        />
        <Button
          className="button--secondary"
          text="30 секунд"
          clickHandle={() => changeTimer(30)}
          disabled={isTimerActive}
        />
        <Button
          className="button--secondary"
          text="20 секунд"
          clickHandle={() => changeTimer(20)}
          disabled={isTimerActive}
        />
        <Button
          className="button--third"
          text="Пропуск"
          clickHandle={skipTimer}
          disabled={!isTimerActive}
        />
      </div>
    </div>
  );
};

export default Timer;
