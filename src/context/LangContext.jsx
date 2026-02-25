import { createContext, useContext } from 'react'

export const LangContext = createContext({ lang: 'et', setLang: () => { } })
export const useLang = () => useContext(LangContext)
