import { QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { queryClient } from './app/query-client.ts'
import { router } from './app/router.tsx'
import { StoreProvider } from './stores/StoreProvider.tsx'
import { ThemeProvider } from './theme/ThemeProvider.tsx'
import 'antd/dist/reset.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <StoreProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </StoreProvider>
    </ThemeProvider>
  </StrictMode>,
)
