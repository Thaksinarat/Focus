//  สร้าง token ปลอม
const toBase64Url = (obj) =>
  btoa(JSON.stringify(obj)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

// สร้าง token หน้าตาแบบ JWT: header.payload.signature
export function createFakeToken(user, expiresAtMs) {
  const header = { alg: 'HS256', typ: 'JWT' }
  // ห้ามใส่ชื่อภาษาไทยใน payload เพราะ btoa จะ error
  const payload = {
    sub: String(user.id),
    role: user.role,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expiresAtMs / 1000),
  }
  const signature = Math.random().toString(36).slice(2) + Date.now().toString(36)
  return `${toBase64Url(header)}.${toBase64Url(payload)}.${signature}`
}