import type { PropsWithChildren } from 'react'
import { rootStore } from './root-store.ts'
import { StoreContext } from './store-context.ts'

export const StoreProvider = ({ children }: PropsWithChildren) => {
  return (
    <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>
  )
}
