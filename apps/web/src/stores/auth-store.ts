import { makeAutoObservable, runInAction } from "mobx";
import { makePersistable } from "mobx-persist-store";
import {
  clearAccessTokenCookie,
  getAccessTokenCookie,
  setAccessTokenCookie,
} from "../services/auth-cookie.ts";
import { fetchCurrentUser, login } from "../services/auth.ts";
import type { CurrentUser, LoginPayload } from "../services/auth.types.ts";

export class AuthStore {
  currentUser: CurrentUser | null = null;
  isHydrating = true;
  isLoggingIn = false;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });

    void makePersistable(
      this,
      {
        name: "LeadStreamAuthStore",
        properties: ["currentUser"],
        storage: window.localStorage,
      },
      { delay: 200 },
    ).finally(() => {
      void this.initializeSession();
    });
  }

  get isAuthenticated() {
    return this.currentUser != null;
  }

  async initializeSession() {
    if (!getAccessTokenCookie()) {
      runInAction(() => {
        this.clearSession();
        this.isHydrating = false;
      });
      return;
    }

    await this.hydrateCurrentUser();
  }

  async hydrateCurrentUser() {
    if (!getAccessTokenCookie()) {
      runInAction(() => {
        this.clearSession();
        this.isHydrating = false;
      });
      return;
    }

    runInAction(() => {
      this.isHydrating = true;
    });

    try {
      const currentUser = await fetchCurrentUser();

      runInAction(() => {
        this.currentUser = currentUser;
      });
    } catch {
      runInAction(() => {
        this.clearSession();
      });
    } finally {
      runInAction(() => {
        this.isHydrating = false;
      });
    }
  }

  async login(credentials: LoginPayload) {
    runInAction(() => {
      this.isLoggingIn = true;
    });

    try {
      const authResponse = await login(credentials);

      runInAction(() => {
        setAccessTokenCookie(authResponse.accessToken);
        this.currentUser = authResponse.user;
      });

      return authResponse.user;
    } catch (error) {
      runInAction(() => {
        this.clearSession();
      });

      throw error;
    } finally {
      runInAction(() => {
        this.isLoggingIn = false;
      });
    }
  }

  logout() {
    this.clearSession();
  }

  private clearSession() {
    this.currentUser = null;
    clearAccessTokenCookie();
  }
}
