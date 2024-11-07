import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import './LanguageSwitcher.scss'

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage()

  const languages = [
    { code: 'en', name: 'En' },
    { code: 'ru', name: 'Ru' },
  ]

  return (
    <div className="language-switcher">
      {languages.map((lng, i) => (
        <>
          <button
            className="language-switcher__lang"
            key={lng.code}
            onClick={() => changeLanguage(lng.code)}
            disabled={lng.code === language}
          >
            {lng.name}
          </button>
          {i < languages.length - 1 && '/'}
        </>
      ))}
    </div>
  )
}

export default LanguageSwitcher
