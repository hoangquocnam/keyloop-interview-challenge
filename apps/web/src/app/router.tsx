import { Navigate, createBrowserRouter } from 'react-router-dom'
import { App } from '../App.tsx'
import { LoginPage } from '../pages/auth/LoginPage.tsx'
import { LeadDetailPage } from '../pages/leads/LeadDetailPage.tsx'
import { LeadInboxPage } from '../pages/leads/LeadInboxPage.tsx'
import { appRoutes } from './routes.ts'

export const router = createBrowserRouter([
  {
    path: appRoutes.root,
    element: <App />,
    children: [
      {
        index: true,
        element: <Navigate replace to={appRoutes.leads} />,
      },
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'leads',
        element: <LeadInboxPage />,
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
])
