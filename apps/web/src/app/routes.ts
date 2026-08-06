export const appRoutes = {
  root: '/',
  dashboard: '/dashboard',
  login: '/login',
  leads: '/leads',
  leadCreate: '/leads/new',
  leadDetail: (leadId: string) => `/leads/${leadId}`,
} as const
