import { useLocation } from 'react-router-dom'
import { TooltipProvider } from '@radix-ui/react-tooltip'
import AdvancedIndex from './advanced/pages/Index'

export default function AdvancedGame() {
  const location = useLocation()
  const state = location.state || {}
  const teamName = state.teamName || state.name || ''
  const investors = state.investors || ''
  return (
    <TooltipProvider>
      <AdvancedIndex initialTeamName={teamName || undefined} initialInvestors={investors} />
    </TooltipProvider>
  )
}
