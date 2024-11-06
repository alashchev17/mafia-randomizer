import { FC, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, useLocation } from 'react-router-dom'

import Title from '../../components/Title'
import GameDeskTitle from '../../components/GameDeskTitle'
import Timer from '../../components/Timer'
import GameDesk from '../../components/GameDesk'
import SessionControls from '../../components/SessionControls'
import GameDeskQueueing from '../../components/GameDeskQueueing'
import GameOver from '../../components/GameOver'

import { pagesAnimate, pagesInitial, pagesTransition } from '../../utils/pagesAnimation'

import { IPlayer } from '../../models'

import './index.scss'

import SessionContextProvider from '../../contexts/SessionContext.tsx'
import { useTranslation } from 'react-i18next'

interface SessionPageProps {
  handleNotification: (state: boolean, text: string) => void
}

const SessionPage: FC<SessionPageProps> = ({ handleNotification }) => {
  const { t } = useTranslation()
  const location = useLocation()

  const innocentPlayers: number = location.state?.innocentPlayers ? location.state.innocentPlayers : 0
  const mafiaPlayers: number = location.state?.mafiaPlayers ? location.state.mafiaPlayers : 0

  const [innocentPlayersAlive, setInnocentPlayersAlive] = useState(innocentPlayers)
  const [mafiaPlayersAlive, setMafiaPlayersAlive] = useState(mafiaPlayers)
  const [isGameOver, setIsGameOver] = useState(false)
  const winner = useRef(t('teams.premature'))

  useEffect(() => {
    if (mafiaPlayersAlive < 1 || mafiaPlayersAlive === innocentPlayersAlive) {
      winner.current = mafiaPlayersAlive === innocentPlayersAlive ? t('teams.mafia') : t('teams.peaceful')
      setIsGameOver(true)
    }
  }, [isGameOver, mafiaPlayersAlive, innocentPlayersAlive, t])

  if (!location.state) {
    return (
      <Navigate
        to="/welcome"
        replace={true}
        state={{
          page: 'session',
          notificationMessage: t('notifications.gameFieldAccess'),
        }}
      />
    )
  }

  const listOfPlayers: IPlayer[] = location.state.players

  if (listOfPlayers.length > 12 || listOfPlayers.length < 6) {
    handleNotification(true, t('notifications.invalidPlayerCount'))
    return <Navigate to="/settings" replace={true} />
  }

  return (
    <SessionContextProvider>
      <motion.section initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition} className="session">
        <Title text={t('headers.sessionPage')} />
        <Timer handleNotification={handleNotification} />
        <GameDeskTitle />
        <AnimatePresence>{isGameOver && <GameOver key="gameover" winner={winner.current} />}</AnimatePresence>
        <div className="session__wrapper">
          <GameDesk
            players={listOfPlayers}
            setInnocentPlayersAlive={setInnocentPlayersAlive}
            setMafiaPlayersAlive={setMafiaPlayersAlive}
            handleNotification={handleNotification}
          />
          <GameDeskQueueing key="queueing-wrapper" listOfPlayers={listOfPlayers} />
        </div>
        <SessionControls setIsGameOver={setIsGameOver} />
      </motion.section>
    </SessionContextProvider>
  )
}

export default SessionPage
