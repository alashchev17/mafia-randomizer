import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import './LanguageSwitcher.scss'

const LanguageSwitcher: React.FC = () => {
  const { language, changeLanguage } = useLanguage()

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
  ]

  return (
    <div className="language-switcher">
      {languages.map((lng) => (
        <button
          className="language-switcher__lang"
          key={lng.code}
          onClick={() => changeLanguage(lng.code)}
          disabled={lng.code === language}
        >
          {lng.name}
        </button>
      ))}
    </div>
  )
}

export default LanguageSwitcher
