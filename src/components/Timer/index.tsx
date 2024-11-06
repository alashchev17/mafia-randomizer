import { FC, useCallback, useEffect, useState } from 'react'

import Button from '../Button'

import './index.scss'
import { useTranslation } from 'react-i18next'

interface TimerProps {
  handleNotification: (state: boolean, text: string) => void
}

const Timer: FC<TimerProps> = ({ handleNotification }) => {
  const { t } = useTranslation()
  const [initialSeconds, setInitialSeconds] = useState(60)
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isTimerActive, setIsTimerActive] = useState(false)

  const startTimer = () => {
    if (!isTimerActive) {
      setIsTimerActive((prev) => !prev)
    }
  }

  const handleTimer = useCallback(() => {
    if (isTimerActive) {
      if (seconds > 0) {
        setSeconds((prev) => prev - 1)
      } else {
        setIsTimerActive((prev) => !prev)
        setSeconds(initialSeconds)
        handleNotification(true, t('notifications.timerCompleted'))
      }
    }
  }, [seconds, isTimerActive, handleNotification, initialSeconds, t])

  const skipTimer = () => {
    if (isTimerActive) {
      setIsTimerActive((prev) => !prev)
      setSeconds(initialSeconds)
      handleNotification(true, t('notifications.timerSkipped'))
    }
  }

  const changeTimer = (amount: number) => {
    setInitialSeconds(amount)
    setSeconds(amount)
  }

  useEffect(() => {
    const interval = setInterval(handleTimer, 1000)
    return () => clearInterval(interval)
  }, [seconds, isTimerActive, handleTimer])

  const timerSeconds = seconds === 60 ? '01:00' : `00:${seconds < 10 ? `0${seconds}` : seconds}`

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
          className={`${isTimerActive ? 'disabled' : ''}`}
        >
          <path onClick={startTimer} d="M0 22.5V0L35 22.5L0 45V22.5Z" fill="white" />
        </svg>
      </div>
      <div className="timer__controls">
        <Button className="button--primary" text={t('buttons.sec60')} clickHandle={() => changeTimer(60)} disabled={isTimerActive} />
        <Button className="button--secondary" text={t('buttons.sec30')} clickHandle={() => changeTimer(30)} disabled={isTimerActive} />
        <Button className="button--secondary" text={t('buttons.sec20')} clickHandle={() => changeTimer(20)} disabled={isTimerActive} />
        <Button className="button--third" text={t('buttons.skipTimer')} clickHandle={skipTimer} disabled={!isTimerActive} />
      </div>
    </div>
  )
}

export default Timer
