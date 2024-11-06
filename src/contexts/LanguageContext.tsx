import React, { createContext, useContext, useState, useEffect } from 'react'
import i18n from '../i18n'

interface LanguageContextProps {
  language: string
  changeLanguage: (lng: string) => void
}

interface LanguageProviderProps {
  children: React.ReactNode
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'ru',
  changeLanguage: () => {},
})

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>(localStorage.getItem('i18nextLng') || 'ru')

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
    setLanguage(lng)
    localStorage.setItem('i18nextLng', lng)
  }

  useEffect(() => {
    const storedLanguage = localStorage.getItem('i18nextLng')
    if (storedLanguage) {
      setLanguage(storedLanguage)
    }
  }, [])

  return <LanguageContext.Provider value={{ language, changeLanguage }}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
