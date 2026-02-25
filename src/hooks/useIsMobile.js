import { useState, useEffect } from 'react'
import { MOBILE_BREAKPOINT } from '../constants'

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(
        typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT
    )
    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])
    return isMobile
}
