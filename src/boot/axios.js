import { defineBoot } from '#q-app'
import axios from 'axios'
// import { useAuthStore } from '@/stores/authStore'

const api = axios.create({
  baseURL: import.meta.env.QCLI_API_URL || 'https://6af186c111a6aa866e805323.mockapi.io/api',
})

// api.interceptors.request.use((config) => {
//   // ตรวจสอบค่าจาก store
//   const authStore = useAuthStore()
//   // config headers
//   config.headers['Content-Type'] = 'application/json; charset=UTF-8'

//   // ถ้ามี token ให้กำหนด headers
//   if (authStore.accessToken) {
//     config.headers['Authorization'] = `Bearer ${authStore.accessToken}`
//   }
//   return config
// }, (error) => {return Promise.reject(error)})

export default defineBoot(({app}) => {
    app.config.globalProperties.$axios = axios

    app.config.globalProperties.$api = api
})

export { axios, api }