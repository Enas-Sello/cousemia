// Type Imports
import type { ChildrenType, Direction } from '@core/types'

// Context Imports
import { VerticalNavProvider } from '@menu/contexts/verticalNavContext'
import { SettingsProvider } from '@core/contexts/settingsContext'
import ThemeProvider from '@components/theme'

// Util Imports
import { getDemoName, getMode, getSettingsFromCookie, getSystemMode } from '@core/utils/serverHelpers'
import AppReactToastify from '@/libs/styles/AppReactToastify'
import themeConfig from '@/configs/themeConfig'
import { NextAuthProvider } from '@/providers/NextAuthProvider'

type Props = ChildrenType & {
  direction: Direction
}

const Providers = (props: Props) => {
  // Props
  const { children, direction } = props

  // Vars
  const mode = getMode()
  const settingsCookie = getSettingsFromCookie()
  const demoName = getDemoName()
  const systemMode = getSystemMode()

  return (
    <NextAuthProvider basePath={process.env.NEXTAUTH_BASEPATH}>
      <VerticalNavProvider>
        <SettingsProvider settingsCookie={settingsCookie} mode={mode} demoName={demoName}>
          <ThemeProvider direction={direction} systemMode={systemMode}>
            {children}
            <AppReactToastify position={themeConfig.toastPosition} />
          </ThemeProvider>
        </SettingsProvider>
      </VerticalNavProvider>
    </NextAuthProvider>
  )
}

export default Providers
