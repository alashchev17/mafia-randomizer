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
        <span key={lng.code}>
          <button className="language-switcher__lang" onClick={() => changeLanguage(lng.code)} disabled={lng.code === language}>
            {lng.name}
          </button>
          {i < languages.length - 1 && '/'}
        </span>
      ))}
    </div>
  )
}

export default LanguageSwitcher
