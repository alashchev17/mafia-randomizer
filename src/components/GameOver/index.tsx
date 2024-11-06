import { FC } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

import Title from '../Title'

import './index.scss'
import { useSessionContext } from '../../contexts/SessionContext.tsx'
import { useTranslation } from 'react-i18next'

interface GameOverProps {
  winner: string
}

const GameOver: FC<GameOverProps> = ({ winner }) => {
  const { t } = useTranslation()
  const gameOverVariants = {
    visible: {
      opacity: 1,
    },
    hidden: {
      opacity: 0,
    },
  }

  const { gameStats } = useSessionContext()
  const stats = gameStats.history

  return (
    <motion.div variants={gameOverVariants} initial="hidden" animate="visible" exit="hidden" className="gameover">
      <Title text={t('headers.gameOver')} />
      <p className="gameover__winner">
        {t('labels.winnerTeam')}: <span className="gameover__team">{winner}</span>
      </p>
      <div className="gameover__row">
        {winner !== t('teams.premature') && (
          <Link
            className="button button--primary"
            to="/stats"
            state={{
              stats,
              winner,
            }}
            replace={true}
          >
            {t('buttons.showHistory')}
          </Link>
        )}
        <Link style={{ display: 'block' }} className="button button--secondary" to="/welcome" replace={true}>
          {t('buttons.backToMain')}
        </Link>
      </div>
    </motion.div>
  )
}

export default GameOver
