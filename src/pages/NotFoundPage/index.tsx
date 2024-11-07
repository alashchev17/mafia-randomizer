import { FC, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

import Title from '../../components/Title'

import './index.scss'
import { pagesAnimate, pagesInitial, pagesTransition } from '../../utils/pagesAnimation.ts'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../contexts/LanguageContext.tsx'

const NotFoundPage: FC = () => {
  const { t } = useTranslation()
  const { language } = useLanguage()

  useEffect(() => {
    document.title = t('titles.page404')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language])

  return (
    <motion.div initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <Title text={t('headers.oops')} />
      <div className="not-found">
        <h3 className="not-found__subtitle">404 - {t('labels.404')}</h3>
        <p className="not-found__description">{t('labels.reason404')}</p>
        <Link to="/welcome" className="button button--secondary">
          {t('buttons.backToMain')}
        </Link>
      </div>
    </motion.div>
  )
}

export default NotFoundPage
