import { makeAutoObservable, runInAction } from 'mobx'
import {
  fetchCurrentUser,
  login,
  type CurrentUser,
  type LoginPayload,
} from '../services/auth.ts'

const AUTH_TOKEN_STORAGE_KEY = 'leadstream.accessToken'

export class AuthStore {
  accessToken: string | null = null
  currentUser: CurrentUser | null = null
  isHydrating = true
  isLoggingIn = false

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true })

    this.accessToken = this.readStoredToken()

    if (this.accessToken) {
      void this.hydrateCurrentUser()
      return
    }

    this.isHydrating = false
  }

  get isAuthenticated() {
    return this.accessToken != null && this.currentUser != null
  }

  async hydrateCurrentUser() {
    if (!this.accessToken) {
      this.isHydrating = false
      return
    }

    runInAction(() => {
      this.isHydrating = true
    })

    try {
      const currentUser = await fetchCurrentUser(this.accessToken)

      runInAction(() => {
        this.currentUser = currentUser
      })
    } catch {
      runInAction(() => {
        this.clearSession()
      })
    } finally {
      runInAction(() => {
        this.isHydrating = false
      })
    }
  }

  async login(credentials: LoginPayload) {
    runInAction(() => {
      this.isLoggingIn = true
    })

    try {
      const authResponse = await login(credentials)

      runInAction(() => {
        this.accessToken = authResponse.accessToken
        this.currentUser = authResponse.user
        this.persistToken(authResponse.accessToken)
      })

      return authResponse.user
    } catch (error) {
      runInAction(() => {
        this.clearSession()
      })

      throw error
    } finally {
      runInAction(() => {
        this.isLoggingIn = false
      })
    }
  }

  logout() {
    this.clearSession()
  }

  private clearSession() {
    this.accessToken = null
    this.currentUser = null
    localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY)
  }

  private persistToken(accessToken: string) {
    localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, accessToken)
  }

  private readStoredToken() {
    return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
  }
}
