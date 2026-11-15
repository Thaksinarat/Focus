import { api } from '@/boot/axios'

// get ทั้งหมด
export const getAllUserData = () => {
    return api.get('/user-data')
}

// get เฉพาะคน
export const getUserDataByUserId = (userId) => {
    return api.get('/user-data', {params: {userId}})
}

// post เพิ่มข้อมูลใหม่
export const createUserData = (data) => {
    return api.post('/user-data', data)
}

// put แก้ไขข้อมูล
export const updateUserData = (id, data) => {
    return api.put(`/user-data/${id}`, data)
}

// delete ลบข้อมูลผู้ใช้ทั้งหมด
export const deleteUserData = (id) => {
    return api.delete(`/user-data/${id}`)
}