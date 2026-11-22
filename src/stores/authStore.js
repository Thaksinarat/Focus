import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getUsers,
  updateUserRole,
  createUser,
  getUserById,
  updateUser,
  deleteUser
} from '@/services/auth.service'
import { createFakeToken } from '@/utils/fakeToken'
import { useUserDataStore } from './userDataStore'

// เวลาเซสซัน (12 ขม.)
const SESSION = 12 * 60 * 60 * 1000

// แปลง user จาก mock api ให้เป็นรูปแบบเดียว
const normalizeUser = (raw) => ({
  id: String(raw.userId ?? raw.id),
  name: raw.name,
  username: raw.username,
  fav_songs: raw.fav_songs ?? [],
  // ค่าอื่นนอกจาก premium ให้เป็น standard หมด
  role: raw.role === 'premium' ? 'premium' : 'standard',
})

export const useAuthStore = defineStore(
  'auth',
  () => {
    const user = ref(null)
    const accessToken = ref(null)
    const sessionExpiresAt = ref(null)
    const loading = ref(false)
    const errorMessage = ref('')

    const isAuthenticated = computed(() => {
      return (
        accessToken.value !== null &&
        sessionExpiresAt.value !== null &&
        Date.now() < sessionExpiresAt.value
      )
    })
    const role = computed(() => user.value?.role ?? null)

    const validateSession = () => {
      if (!accessToken.value || !sessionExpiresAt.value) {
        return false
      }
      if (Date.now() >= sessionExpiresAt.value) {
        logout()
        return false
      }
      return true
    }

    // เริ่มเก็บ session: เก็บ user + ออก token ปลอม + ตั้งเวลาหมดอายุ
    const startSession = (rawData) => {
      // ลบ user.value ออกได้
      user.value = normalizeUser(rawData)
      sessionExpiresAt.value = Date.now() + SESSION
      accessToken.value = createFakeToken(user.value, sessionExpiresAt.value)
    }

    // เข้าสู่ระบบ
    const login = async (username, password) => {
      loading.value = true
      errorMessage.value = ''
      try {
        const response = await getUsers()
        const foundUser = response.data.find(
          (item) => item.username === username && item.password === password,
        )
        if (!foundUser) {
          throw new Error('Username or Password incorrect.')
        }
        startSession(foundUser)
        return user.value
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || error.message || `Can't sign in, Try again.`
        throw error
      } finally {
        loading.value = false
      }
    }

    // สมัครบัญชีใหม่
    const register = async ({ name, username, password }) => {
      loading.value = true
      errorMessage.value = ''
      try {
        const response = await getUsers()
        if (response.data.some((item) => item.username === username)) {
          throw new Error('Username has used, Try another username.')
        }
        const { data } = await createUser({
          name,
          username,
          password,
          role: 'standard', // สมัครใหม่เป็น standard เสมอ
          fav_songs: [],
        })
        startSession(data) // สมัครเสร็จ login ให้เลย
        return user.value
      } catch (error) {
        errorMessage.value =
          error.response?.data?.message || error.message || `Can't subscript premium package, Try again.`
        throw error
      } finally {
        loading.value = false
      }
    }

    // สมัคร premium
    const upgradeToPremium = async () => {
      if (!user.value) {
        throw new Error('Please Sign in first.')
      }
      if (role.value === 'premium') {
        throw new Error('You have already been premium member.')
      }

      loading.value = true
      try {
        // 1) อัปเดต role ใน mockapi
        await updateUserRole(user.value.id, 'premium')

        // 2) อัปเดต role ใน store เอง (ไม่เอา response มาแทนทั้งก้อน)
        user.value = { ...user.value, role: 'premium' }

        // 3) ออก token ใหม่ที่มี role ใหม่ (อายุ session เท่าเดิม)
        accessToken.value = createFakeToken(user.value, sessionExpiresAt.value)

        return user.value
      } finally {
        loading.value = false
      }
    }

    // แก้ข้อมูล user (name, password, role ฯลฯ) แล้วซิงก์กลับเข้า store
    const updateProfile = async (changes) => {
      if (!user.value) throw new Error('Please Sign in first.')
      const { data: current } = await getUserById(user.value.id) // ดึงข้อมูลล่าสุดมาก่อน
      const { data } = await updateUser(user.value.id, { ...current, ...changes })
      user.value = normalizeUser(data)
      accessToken.value = createFakeToken(user.value, sessionExpiresAt.value)
      return user.value
    }

    // ล้างข้อมูลทุกอย่างของ user ก่อนหน้า
    const logout = () => {
      user.value = null
      accessToken.value = null
      sessionExpiresAt.value = null
      errorMessage.value = ''
      useUserDataStore().reset()
    }

    // ลบบัญชี
    const deleteAccount = async () => {
        if (!user.value) {
            throw new Error("Please Log-in")
        }
        const dataStore = useUserDataStore()
        await dataStore.load(user.value.id)
        await dataStore.remove()
        await deleteUser(user.value.id)
    }

    return {
      user,
      accessToken,
      loading,
      errorMessage,
      isAuthenticated,
      role,
      login,
      register,
      updateProfile,
      logout,
      upgradeToPremium,
      sessionExpiresAt,
      validateSession,
      deleteAccount
    }
  },
  {
    persist: true,
  },
)
