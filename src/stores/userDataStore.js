import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserDataByUserId, createUserData, updateUserData, deleteUserData } from '@/services/user-data.service'

export const useUserDataStore = defineStore('userData', () => {
  // id ของ record ใน mockapi (ใช้ตอน PUT)
  const dataId = ref(null)
  // เจ้าของ record
  const userId = ref(null)
  const tasks = ref([])
  const songs = ref([])
  const loading = ref(false)

  // กันโหลดซ้ำ
  let pending = null
  let pendingFor = null

  const load = (uid) => {
    const id = String(uid)

    // โหลดของ user คนนี้ไว้แล้ว
    if (dataId.value && userId.value === id) return Promise.resolve()
    // กำลังโหลดของ user คนนี้อยู่ ให้รอตัวเดิม
    if (pending && pendingFor === id) return pending

    pendingFor = id
    const p = (async () => {
      loading.value = true
      try {
        let record = null
        try {
          const { data } = await getUserDataByUserId(id)
          record = data.find((d) => String(d.userId) === id) ?? null
        } catch (err) {
          if (err?.response?.status !== 404) throw err
        }

        // user ใหม่ ยังไม่มี record ให้สร้างใหม่
        if (!record) {
          const res = await createUserData({ userId: id, tasks: [], songs: [] })
          record = res.data
        }

        dataId.value = record.id
        userId.value = id
        tasks.value = Array.isArray(record.tasks) ? record.tasks : []
        songs.value = Array.isArray(record.songs) ? record.songs : []
      } finally {
        loading.value = false
        if (pending === p) pending = null
      }
    })()
    pending = p
    return p
  }

  // บันทึก tasks + songs ทั้งก้อนลง record ของ user คนนี้
  const save = async () => {
    if (!dataId.value) throw new Error("haven't load user data yet.")
    await updateUserData(dataId.value, {
      userId: userId.value,
      tasks: tasks.value,
      songs: songs.value,
    })
  }

  // ล้างข้อมูล
  const reset = () => {
    dataId.value = null
    userId.value = null
    tasks.value = []
    songs.value = []
    pending = null
    pendingFor = null
  }

//   ลบข้อมูลของ user ตอนลบ บัญชี
const remove = async () => {
    if (dataId.value) {
        await deleteUserData(dataId.value)
    }
    reset()
}

  return { dataId, userId, tasks, songs, loading, load, save, reset, remove }
})
