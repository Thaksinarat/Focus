import { api } from '@/boot/axios'

// Login
export const getUsers = () => {
    return api.get('/users')
}

// ดึงข้อมูลผู้ใช้รายบุคคล
export const getUserById = (id) => {
    return api.get(`/users/${id}`)
}

// อัปเดตข้อมูลผู้ใช้ 
export const updateUser = (id, userData) => {
    return api.put(`/users/${id}`, userData)
}

// อัปเดต Role
export const updateUserRole = (id, role) => {
    return api.put(`/users/${id}`, { role })
}

// สมัครสมาชิก
export const createUser = (userData) => {
    return api.post('/users', userData)
}

// ลบบัญชี
export const deleteUser = (id) => {
    return api.delete(`/users/${id}`)
}