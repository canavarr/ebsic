import { createContext, useContext } from 'react'
import { T } from './translations'

export const LangContext = createContext({ lang: 'et', setLang: () => {} })
export const useLang = () => useContext(LangContext)

/** @deprecated Use T from translations for nav strings */
export const NAV_T = {
  et: { navClub: T.et.navClub, navEst: T.et.navEst, navEn: T.et.navEn, navBack: T.et.navBack },
  en: { navClub: T.en.navClub, navEst: T.en.navEst, navEn: T.en.navEn, navBack: T.en.navBack },
}
