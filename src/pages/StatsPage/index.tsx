import { FC, useMemo } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import Title from '../../components/Title'

import { pagesAnimate, pagesInitial, pagesTransition } from '../../utils/pagesAnimation.ts'
import { IGameHistory } from '../../models'

import './index.scss'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../contexts/LanguageContext.tsx'

const StatsPage: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const { language } = useLanguage()
  const { stats, winner } = location.state

  const winnerClassNames = useMemo(
    () => `stats__winner ${winner === t('teams.mafia') ? 'stats__winner--mafia' : 'stats__winner--innocent'}`,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [language, winner]
  )

  if (stats) {
    return (
      <motion.div className="stats" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
        <Title text={t('headers.gameResults')} />
        <h2 className="stats__subtitle">{t('labels.winnerTeam')}</h2>
        <span className={winnerClassNames}>{winner}</span>
        <h2 className="stats__subtitle">{t('labels.historyOfPlayersLeave')}</h2>
        <ul className="stats__list">
          {stats.map((item: IGameHistory) => (
            <li className="stats__list-item" key={item.playerId}>
              <div className="stats__list-player">
                {t('labels.player')} №{item.playerId}
                <img src={item.playerCard} alt="Card: Player Card" />
              </div>
              <div className="stats__list-description">
                <span>
                  {t('labels.gameTime')}:{' '}
                  <span className="stats__strong">{item.timestamp.type === 'День' ? t('labels.day') : t('labels.night')}</span>
                </span>
                <span>
                  {t('labels.gameCycle')}: <span className="stats__strong">{item.timestamp.cycle}</span>
                </span>
                <span>
                  {t('labels.leaveReason')}: <span className="stats__strong">{item.reason}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
        <Link className="button button--primary" to="/welcome" replace={true}>
          {t('buttons.backToMain')}
        </Link>
      </motion.div>
    )
  } else {
    return <Navigate to="/" replace={true} />
  }
}

export default StatsPage
