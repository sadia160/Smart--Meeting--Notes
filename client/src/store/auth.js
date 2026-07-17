import { reactive } from 'vue'
import { api } from '../api'

const state = reactive({
  user: JSON.parse(localStorage.getItem('smn_user') || 'null'),
  loading: false,
  error: '',
})

export function useAuth() {
  async function signup(name, email, password) {
    state.loading = true
    state.error = ''
    try {
      const data = await api.signup({ name, email, password })
      state.user = data.user
      localStorage.setItem('smn_user', JSON.stringify(data.user))
      localStorage.setItem('smn_token', data.token)
    } catch (err) {
      state.error = err.message || 'Signup failed'
      throw err
    } finally {
      state.loading = false
    }
  }

  async function login(email, password) {
    state.loading = true
    state.error = ''
    try {
      const data = await api.login({ email, password })
      state.user = data.user
      localStorage.setItem('smn_user', JSON.stringify(data.user))
      localStorage.setItem('smn_token', data.token)
    } catch (err) {
      state.error = err.message || 'Login failed'
      throw err
    } finally {
      state.loading = false
    }
  }

  function logout() {
    state.user = null
    localStorage.removeItem('smn_user')
    localStorage.removeItem('smn_token')
  }

  return { state, login, signup, logout }
}
