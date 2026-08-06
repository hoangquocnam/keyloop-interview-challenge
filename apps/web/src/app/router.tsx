import { Navigate, createBrowserRouter } from 'react-router-dom'
import { App } from '../App.tsx'
import { LoginPage } from '../pages/auth/LoginPage.tsx'
import { DashboardPage } from '../pages/dashboard/DashboardPage.tsx'
import { CreateLeadPage } from '../pages/leads/CreateLeadPage.tsx'
import { LeadDetailPage } from '../pages/leads/LeadDetailPage.tsx'
import { LeadInboxPage } from '../pages/leads/LeadInboxPage.tsx'
import { RequireAuth, RequireGuest } from './route-guards.tsx'
import { appRoutes } from './routes.ts'

export const router = createBrowserRouter([
  {
    element: <RequireGuest />,
    children: [
      {
        path: appRoutes.login,
        element: <LoginPage />,
      },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        path: appRoutes.root,
        element: <App />,
        children: [
          {
            index: true,
            element: <Navigate replace to={appRoutes.leads} />,
          },
          {
            path: 'dashboard',
            element: <DashboardPage />,
          },
          {
            path: 'leads',
            element: <LeadInboxPage />,
          },
          {
            path: 'leads/new',
            element: <CreateLeadPage />,
          },
          {
            path: 'leads/:leadId',
            element: <LeadDetailPage />,
          },
          {
            path: '*',
            element: <Navigate replace to={appRoutes.leads} />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate replace to={appRoutes.leads} />,
  },
])
