import { createContext } from 'react'
import { rootStore, type RootStore } from './root-store.ts'

export const StoreContext = createContext<RootStore>(rootStore)
