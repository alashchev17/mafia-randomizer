import { FC, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

import Title from '../../components/Title'
import DescriptionParagraph from '../../components/DescriptionParagraph'

import { useDatabaseTexts } from '../../hooks/useDatabaseTexts'
import { useTranslation } from 'react-i18next'

import type { IDatabaseDescription } from '../../assets/database'
import { pagesAnimate, pagesInitial, pagesTransition } from '../../utils/pagesAnimation'

const MainPage: FC = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const database = useDatabaseTexts()

  const [description, setDescription] = useState<IDatabaseDescription>({} as IDatabaseDescription)

  useEffect(() => {
    document.title = t('titles.welcomePage')

    const currentLocation = location.pathname.split('/')[1]

    const description: IDatabaseDescription = database.descriptions.find((d) => d.path === currentLocation)!
    setDescription(description)
  }, [location, database.descriptions, t])

  return (
    <motion.div className="container__mainpage" initial={pagesInitial} animate={pagesAnimate} transition={pagesTransition}>
      <div className="flex-center-column">
        <Title text={t('headers.mainHeader')} />
        <DescriptionParagraph descriptionText={description.text} descriptionStrong={description.title} />
        <div className="flex-row-wrapper">
          <Link to={'/setup/1'} className="button button--primary">
            {t('buttons.startGame')}
          </Link>
          <Link to={'/information'} className="button button--secondary">
            {t('buttons.roleInfo')}
          </Link>
          <a href="https://github.com/alashchev17/mafia-randomizer" target="_blank" className="button button--third">
            {t('buttons.sourceCode')}
          </a>
        </div>
      </div>
    </motion.div>
  )
}

export default MainPage
