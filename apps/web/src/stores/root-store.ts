import { makeAutoObservable } from "mobx";
import { makePersistable } from "mobx-persist-store";
import { AuthStore } from "./auth-store.ts";
import { LeadStore } from "./lead-store.ts";

class UiStore {
  sidebarCollapsed = false;

  constructor() {
    makeAutoObservable(this);

    void makePersistable(
      this,
      {
        name: "LeadStreamUiStore",
        properties: ["sidebarCollapsed"],
        storage: window.localStorage,
      },
      { delay: 200 },
    );
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  setSidebarCollapsed(value: boolean) {
    this.sidebarCollapsed = value;
  }
}

export class RootStore {
  readonly auth: AuthStore;
  readonly lead: LeadStore;
  readonly ui: UiStore;

  constructor() {
    this.auth = new AuthStore();
    this.lead = new LeadStore();
    this.ui = new UiStore();

    makeAutoObservable(this, {}, { autoBind: true });
  }

  logOut() {
    this.lead.reset();
    this.auth.logout();
  }
}

export const rootStore = new RootStore();
