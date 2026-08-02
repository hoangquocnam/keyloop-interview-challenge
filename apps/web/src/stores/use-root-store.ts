import { useContext } from 'react'
import { StoreContext } from './store-context.ts'

export const useRootStore = () => useContext(StoreContext)
