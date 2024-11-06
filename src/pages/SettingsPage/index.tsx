import { Dispatch, FC, FormEventHandler, SetStateAction, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

import Title from '../../components/Title'
import NumberInput from '../../components/NumberInput'

import './index.scss'

import { useDatabaseTexts } from '../../hooks/useDatabaseTexts.ts'
import { ISettings } from '../../models'
import { pagesAnimate, pagesInitial, pagesTransition } from '../../utils/pagesAnimation.ts'
import { useTranslation } from 'react-i18next'

interface SettingsPageProps {
  settings: ISettings
  setSettings: Dispatch<SetStateAction<ISettings>>
  handleNotification: (state: boolean, text: string) => void
}

type FormFields = {
  players: HTMLInputElement
  gameMode: HTMLInputElement
}

const SettingsPage: FC<SettingsPageProps> = ({ settings, setSettings, handleNotification }) => {
  const { t } = useTranslation()
  const database = useDatabaseTexts()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = t('titles.settingsPage')
  }, [t])

  const [isValid, setIsValid] = useState(true)
  const handleSubmit: FormEventHandler<HTMLFormElement & FormFields> = (event) => {
    event.preventDefault()
    if (isValid) {
      const form = event.currentTarget

      const amountOfPlayers = Number(form.players.value)
      const gameMode = form.gameMode.value
      if (amountOfPlayers >= 6 && amountOfPlayers <= 12) {
        handleNotification(true, t('notifications.settingsSaved'))
        setSettings((prev: ISettings): ISettings => {
          return {
            ...prev,
            amountOfPlayers,
            gameMode,
          }
        })
        navigate('/')
      } else {
        handleNotification(true, t('notifications.invalidPlayerCount'))
      }
    } else {
      handleNotification(true, t('notifications.settingsSaveError'))
    }
  }

  const buttonClassNames = `button button--primary ${isValid ? '' : 'disabled'}`

  return (
    <motion.div className="flex-center-column settings" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <Title text={t('titles.settingsPage').split('|')[1]} />
      <form className="settings__form" onSubmit={handleSubmit}>
        <NumberInput
          label={t('labels.amountOfPlayers')}
          name="players"
          currentValue={settings.amountOfPlayers}
          setButtonValid={setIsValid}
        />
        <label className="label">
          {t('labels.gameMode')}
          <div className="select-wrapper">
            <select name="gameMode" defaultValue={settings.gameMode}>
              <option value={t('selects.gameMode.defaultValue')} disabled>
                {t('selects.gameMode.defaultValue')}
              </option>
              {database.gameModes.map((item) => {
                if (item.title === settings.gameMode) {
                  return (
                    <option key={item.title} value={item.title}>
                      {item.title}
                    </option>
                  )
                }
                return (
                  <option key={item.title} value={item.title}>
                    {item.title}
                  </option>
                )
              })}
            </select>
          </div>
        </label>
        <button className={buttonClassNames} disabled={!isValid} type="submit">
          {t('buttons.saveChanges')}
        </button>
      </form>
    </motion.div>
  )
}

export default SettingsPage
