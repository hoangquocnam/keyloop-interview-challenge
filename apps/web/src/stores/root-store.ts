import { makeAutoObservable } from 'mobx'

class UiStore {
  sidebarCollapsed = false

  constructor() {
    makeAutoObservable(this)
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed
  }

  setSidebarCollapsed(value: boolean) {
    this.sidebarCollapsed = value
  }
}

export class RootStore {
  readonly ui = new UiStore()

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })
  }
}

export const rootStore = new RootStore()
