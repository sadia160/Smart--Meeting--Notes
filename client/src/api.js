import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const http = axios.create({ baseURL: BASE_URL })

http.interceptors.request.use((config) => {
  if (config.auth !== false) {
    const token = localStorage.getItem('smn_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

async function request(path, { method = 'GET', body, auth = true } = {}) {
  try {
    const res = await http.request({ url: path, method, data: body, auth })
    return res.data
  } catch (err) {
    const message = err.response?.data?.message || `Request failed (${err.response?.status || 0})`
    throw new Error(message)
  }
}

export const api = {
  signup: (payload) => request('/auth/signup', { method: 'POST', body: payload, auth: false }),
  login: (payload) => request('/auth/login', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),

  getMeetings: () => request('/meetings'),
  getMeeting: (id) => request(`/meetings/${id}`),
  createMeeting: (payload) => request('/meetings', { method: 'POST', body: payload }),
  updateMeeting: (id, payload) => request(`/meetings/${id}`, { method: 'PATCH', body: payload }),
  toggleAction: (meetingId, index) =>
    request(`/meetings/${meetingId}/actions/${index}/toggle`, { method: 'PATCH' }),
  deleteMeeting: (id) => request(`/meetings/${id}`, { method: 'DELETE' }),
}
