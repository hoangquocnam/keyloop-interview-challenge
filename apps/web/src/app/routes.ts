export const appRoutes = {
  root: '/',
  dashboard: '/dashboard',
  login: '/login',
  leads: '/leads',
  leadDetail: (leadId: string) => `/leads/${leadId}`,
} as const
