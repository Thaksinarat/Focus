import { defineStore } from 'pinia'
import { ref } from 'vue'
// import services
import {
  getUserDataByUserId as getById,
  createUserData as createData,
  updateUserData as updateData,
} from '@/services/user-data.service'

export const useTaskStore = defineStore('task', () => {
  // state
  // เก็บ id ของ user-data (ตอนจะ PUT)
  const dataId = ref(null)
  const userId = ref(null)
  // เก็บ tasks
  const tasks = ref([])
  // ตัวโหลด
  const loading = ref(false)

  // action
  // function ดึงข้อมูล
  const fetchTasks = async (id) => {
    loading.value = true

    try {
      // ดึงข้อมูล
      const res = await getById(id)
      console.log('res.data =', res.data)
      // หา user-data ของ user
      const data = res.data.find((d) => String(d.userId) === String(id))

      if (data) {
        // เจอ data
        dataId.value = data.id
        userId.value = data.userId
        tasks.value = data.tasks ?? []
      } else {
        // ไม่เจอ data แสดงว่าเป็น user ใหม่ ให้สร้าง user-data
        const create = await createData({ userId: String(id), tasks: [], songs: [] })
        dataId.value = create.data.id
        userId.value = id
        tasks.value = []
      }
    } catch (error) {
      console.log('fetchTasks Error: ', error)
    } finally {
      loading.value = false
    }
  }
  //   function บันทึก tasks ทั้งหมด
  const saveTasks = async () => {
    await updateData(dataId.value, { tasks: tasks.value })
  }
  // function เพิ่ม task
  const addTask = async ({ title, detail }) => {
    // ใส่งานใหม่เพิ่มเข้าไปที่ tasks
    tasks.value.push({
      // id ของงาน
      id: Date.now(),
      // หัวข้อ
      title,
      // รายละเอียด
      detail,
      // สถานะเริ่มต้นเป็นยังไม่เสร็จ
      status: false,
    })
    // บันทึก
    await saveTasks()
  }
  // function แก้หัวข้อ/รายละเอียดงาน
  const editTask = async (id, { title, detail }) => {
    // หา task ที่ต้องการจะลบก่อน
    const task = tasks.value.find((t) => t.id === id)
    // ถ้าไม่เจอ task ให้ return ออกเลย
    if (!task) return
    // ถ้าเจอ task ให้เปลี่ยนค่า
    task.title = title
    task.detail = detail
    // บันทึก
    await saveTasks()
  }
  // function สลับสถานะ task
  const toggleStatus = async (id) => {
    // หา task ที่ต้องการจะลบก่อน
    const task = tasks.value.find((t) => t.id === id)
    // ถ้าไม่เจอ task ให้ return ออกเลย
    if (!task) return
    // ถ้าเจอ task ให้เปลี่ยนค่า
    task.status = !task.status
    // บันทึก
    await saveTasks()
  }
  // function ลบ task 1
  const deleteTask = async (id) => {
    tasks.value = tasks.value.filter((t) => t.id !== id)
    // บันทึก
    await saveTasks()
  }

  //   return
  return (
    {
      dataId,
      userId,
      tasks,
      loading,
      fetchTasks,
      addTask,
      editTask,
      toggleStatus,
      deleteTask,
    }
  )
})
