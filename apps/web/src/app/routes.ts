export const appRoutes = {
  root: '/',
  login: '/login',
  leads: '/leads',
  leadDetail: (leadId: string) => `/leads/${leadId}`,
} as const
