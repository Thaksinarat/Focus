import { defineBoot } from '#q-app'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.QCLI_API_URL || 'https://6aff1f473a0e70bc8d54a855.mockapi.io/api',
})

api.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  // กำหนด Content-type
  config.headers['Content-Type'] = 'application/json; charset=UTF-8'

  // ตรวจ session ก่อนส่ง request
  if (authStore.accessToken && !authStore.validateSession()) {
    return Promise.reject(new Error('Session หมดอายุ กรุณา Login ใหม่'))
  }

  // ส่ง Access Token ไปกับ Request
  if (authStore.accessToken) {
    config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const authStore = useAuthStore()
    if (error.response?.status === 401) {
      authStore.logout()
      window.location.assign('/sign-in')
    }
    return Promise.reject(error)
  }
)

export default defineBoot(({app}) => {
    app.config.globalProperties.$axios = axios

    app.config.globalProperties.$api = api
})

export { axios, api }