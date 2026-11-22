import { defineStore } from 'pinia'
import { computed } from 'vue'
import { useUserDataStore } from '@/stores/userDataStore'

export const useTaskStore = defineStore('task', () => {
  const dataStore = useUserDataStore()

  // ใช้ข้อมูล userDataStore
  const tasks = computed(() => dataStore.tasks)
  const loading = computed(() => dataStore.loading)

  // ดึงข้อมูลของ user ตาม id ที่ส่งมา
  const fetchTasks = (userId) => dataStore.load(userId)

  // เพิ่ม task
  const addTask = async ({ title, detail }) => {
    dataStore.tasks.push({
      id: Date.now(),
      title,
      detail,
      status: false,
    })
    await dataStore.save()
  }

  // แก้ไข task
  const editTask = async (id, { title, detail }) => {
    const task = dataStore.tasks.find((t) => t.id === id)
    if (!task) return
    task.title = title
    task.detail = detail
    await dataStore.save()
  }

  // สลับสถานะ
  const toggleStatus = async (id) => {
    const task = dataStore.tasks.find((t) => t.id === id)
    if (!task) return
    task.status = !task.status
    await dataStore.save()
  }

  // ลบ task
  const deleteTask = async (id) => {
    dataStore.tasks = dataStore.tasks.filter((t) => t.id !== id)
    await dataStore.save()
  }

  return { tasks, loading, fetchTasks, addTask, editTask, toggleStatus, deleteTask }
})