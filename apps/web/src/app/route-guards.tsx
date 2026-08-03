import { Spin } from 'antd'
import { observer } from 'mobx-react-lite'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Text } from '../components/Text/index.ts'
import { View } from '../components/View/index.ts'
import { COLORS, SPACING } from '../theme/design-tokens.ts'
import { appRoutes } from './routes.ts'
import { useRootStore } from '../stores/use-root-store.ts'

const AuthGuardFallback = () => {
  return (
    <View
      as="main"
      alignItems="center"
      backgroundColor={COLORS.white}
      gap={SPACING.md}
      justifyContent="center"
      minHeight="100vh"
      px={SPACING.lg}
    >
      <Spin size="large" />
      <Text color={COLORS.textSecondary}>Restoring your session...</Text>
    </View>
  )
}

export const RequireAuth = observer(() => {
  const { auth } = useRootStore()
  const location = useLocation()

  if (auth.isHydrating) {
    return <AuthGuardFallback />
  }

  if (!auth.isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to={appRoutes.login}
      />
    )
  }

  return <Outlet />
})

export const RequireGuest = observer(() => {
  const { auth } = useRootStore()

  if (auth.isHydrating) {
    return <AuthGuardFallback />
  }

  if (auth.isAuthenticated) {
    return <Navigate replace to={appRoutes.leads} />
  }

  return <Outlet />
})
