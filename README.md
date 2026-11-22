# Focus

เว็บแอปช่วยจดจ่อกับงาน รวมนาฬิกานับถอยหลัง, รายการงานที่ต้องทำ และเครื่องเล่นเพลงจาก YouTube ไว้ในที่เดียว

🔗 **เว็บไซต์:** https://focus-ashen-eight.vercel.app/

---

## Focus คืออะไร

Focus ช่วยให้ทำงานได้ต่อเนื่องโดยไม่ต้องสลับหลายแอป

1. ตั้งเวลาโฟกัส (เช่น 25 นาที)
2. เขียนงานที่ต้องทำไว้ในหน้าเดียวกัน
3. เปิดเพลงฟังไปด้วยได้ (สำหรับสมาชิก Premium)
4. พอหมดเวลา เสียงเตือนจะดังและเพลงจะหยุดให้อัตโนมัติ

ข้อมูลของแต่ละบัญชีแยกกัน ใครสมัครก็มีงานและเพลงเป็นของตัวเอง

---

## ทำอะไรได้บ้าง

### สำหรับสมาชิกทุกคน (Standard)

| ฟีเจอร์ | รายละเอียด |
|---|---|
| สมัครสมาชิก / เข้าสู่ระบบ | สมัครด้วยชื่อ, username, password แล้วเข้าใช้งานได้ทันที |
| นาฬิกาจับเวลา | เลือก 25 นาที, 30 นาที หรือตั้งเองเป็นนาที/วินาที มีปุ่ม Start/Stop และ Reset |
| เสียงเตือน | เมื่อหมดเวลา เสียงเตือนจะดังวนซ้ำจนกว่าจะกด OK |
| รายการงาน (To-do) | เพิ่ม, แก้ไข, ลบ และติ๊กว่างานเสร็จแล้ว |
| กรองงาน | ดูได้ทั้งหมด / ยังไม่เสร็จ / เสร็จแล้ว |
| ตั้งค่าบัญชี | เปลี่ยนชื่อ, เปลี่ยนรหัสผ่าน (ต้องยืนยันรหัสเดิมก่อน) |
| ลบบัญชี | ลบบัญชีและข้อมูลทั้งหมดของตัวเองถาวร |

### เพิ่มเติมสำหรับสมาชิก Premium

| ฟีเจอร์ | รายละเอียด |
|---|---|
| เครื่องเล่นเพลง (PlayBar) | เล่นเพลงจากลิงก์ YouTube อยู่ที่แถบด้านล่างของหน้าจอ |
| จัดการเพลง | เพิ่ม, แก้ไข, ลบเพลง และค้นหาตามชื่อ |
| เพลงที่ชอบ | กดหัวใจเก็บเพลงโปรด และกรองดูเฉพาะเพลงที่ชอบได้ |
| เพลงถัดไปอัตโนมัติ | จบเพลงแล้วเล่นเพลงต่อไป ถ้าเล่นเพลงไหนไม่ได้จะข้ามให้ |
| หยุดเพลงเมื่อหมดเวลา | เมื่อนาฬิกาหมดเวลา เพลงจะหยุดเอง |
| หน้า Premium | หน้าสรุปสิทธิ์ของสมาชิก Premium |

---

## เงื่อนไขการใช้งาน

### บัญชีและสิทธิ์
- **สมัครใหม่ทุกคนจะเป็น `standard`** กดปุ่ม "สมัคร Premium" ที่แถบด้านบนเพื่ออัปเกรดเป็น `premium`
- สมาชิก `standard` **จะไม่เห็นแถบเล่นเพลง** และเข้าหน้า `/premium` ไม่ได้ (ระบบจะพากลับหน้าแรก)
- สมาชิก Premium ยกเลิกได้เองที่หน้า Settings แล้วจะกลับเป็น `standard` ทันที
- Premium ในโปรเจกต์นี้ **เป็นการจำลอง** ไม่มีการชำระเงินจริง

### การสมัครและเข้าสู่ระบบ
- username **ซ้ำกับคนอื่นไม่ได้**
- password ต้องยาวอย่างน้อย **6 ตัวอักษร**
- เซสชันอยู่ได้ **30 นาที** หลังเข้าสู่ระบบ หมดเวลาแล้วต้องเข้าสู่ระบบใหม่
- หน้าแรก, Settings และ Premium ต้องเข้าสู่ระบบก่อนจึงจะเข้าได้

### เพลง
- รองรับเฉพาะลิงก์ **YouTube** (`youtube.com/watch?v=`, `youtu.be/`, `/shorts/`, `/embed/`, `/live/`)
- ลิงก์ที่ไม่ใช่ YouTube หรือเป็นลิงก์ผิดรูปแบบจะบันทึกไม่ได้
- วิดีโอที่เจ้าของไม่อนุญาตให้ฝังเล่น จะเล่นไม่ได้และระบบจะข้ามไปเพลงถัดไป

### ข้อมูล
- ข้อมูลทุกอย่างเก็บบน MockAPI ถ้าเปลี่ยนอุปกรณ์แล้วเข้าสู่ระบบบัญชีเดิม จะเห็นข้อมูลเดิม
- การลบบัญชี **ย้อนกลับไม่ได้**

---

## เทคโนโลยีที่ใช้

- [Vue 3](https://vuejs.org/) + [Quasar Framework](https://quasar.dev/) (Vite)
- [Pinia](https://pinia.vuejs.org/) จัดการ state + `pinia-plugin-persistedstate`
- [Vue Router](https://router.vuejs.org/) พร้อม route guard ตามการล็อกอินและ role
- [Axios](https://axios-http.com/) เรียก REST API
- [MockAPI](https://mockapi.io/) เป็น backend จำลอง
- YouTube IFrame Player API
- Font Awesome

---

## โครงสร้างโปรเจกต์

```
src/
├── boot/         axios (พร้อม interceptor แนบ token) และ pinia
├── components/   NavbarMain, FocusTime, TodoList, PlayBar
├── layouts/      MainLayout
├── pages/        Home, Signin, Signup, Setting, Premium, ErrorNotFound
├── router/       routes และ route guard
├── services/     ฟังก์ชันเรียก API (auth, user-data)
├── stores/       authStore, userDataStore, taskStore, songStore
├── utils/        fakeToken (สร้าง token จำลอง)
└── assets/sounds/alarm.mp3
```

---

## ระบบ Token (จำลอง)

เนื่องจากใช้ MockAPI จึงไม่มี backend ออก token จริง ระบบจึงสร้าง token หน้าตาแบบ JWT (`header.payload.signature`) ขึ้นมาเองฝั่ง client

- payload มี `sub` (id ผู้ใช้), `role`, `iat`, `exp`
- ถูกแนบไปกับทุก request ใน header `Authorization: Bearer <token>`
- ออก token ใหม่ทุกครั้งที่ role หรือโปรไฟล์เปลี่ยน
- ไม่เก็บ password ใน localStorage

> ⚠️ เป็นการจำลองเพื่อการเรียนรู้ ระบบจริงต้องให้ backend เป็นผู้เข้ารหัสรหัสผ่านและออก/ตรวจ token

---

## โครงสร้างข้อมูลบน MockAPI

### `users`
| ฟิลด์ | ชนิด | หมายเหตุ |
|---|---|---|
| id | Object ID | สร้างโดย MockAPI |
| name | String | ชื่อที่แสดง |
| username | String | ใช้เข้าสู่ระบบ ห้ามซ้ำ |
| password | String | |
| role | String | `standard` หรือ `premium` |
| fav_songs | Array | |

### `user-data` (1 บัญชี = 1 record)
| ฟิลด์ | ชนิด | หมายเหตุ |
|---|---|---|
| id | Object ID | สร้างโดย MockAPI |
| userId | String | id ของเจ้าของข้อมูล |
| tasks | Array | รายการงาน |
| songs | Array | รายการเพลง |

---

## วิธีรันบนเครื่อง

ต้องมี [Node.js](https://nodejs.org/) ติดตั้งไว้

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. (ไม่บังคับ) สร้างไฟล์ .env เพื่อระบุ API ของตัวเอง
#    ถ้าไม่ตั้ง จะใช้ค่าเริ่มต้นที่เขียนไว้ใน src/boot/axios.js
echo QCLI_API_URL=https://xxxxxxxx.mockapi.io/api > .env

# 3. รันโหมดพัฒนา
npx quasar dev

# 4. สร้างไฟล์สำหรับ production (ผลลัพธ์อยู่ที่ dist/spa)
npx quasar build
```

### ตัวแปรสภาพแวดล้อม

| ชื่อ | ความหมาย |
|---|---|
| `QCLI_API_URL` | URL ฐานของ MockAPI (ต้องขึ้นต้นด้วย `QCLI_` เพื่อให้ Quasar ส่งค่าเข้าแอป) |

---

## Deploy บน Vercel

| ตั้งค่า | ค่า |
|---|---|
| Framework Preset | Other |
| Build Command | `npx quasar build` |
| Output Directory | `dist/spa` |
| Environment Variables | `QCLI_API_URL` (ตั้งก่อน build เพราะค่าถูกฝังตอน build) |

ถ้า Router ตั้งเป็นโหมด `history` ให้เพิ่มไฟล์ `vercel.json` เพื่อไม่ให้รีเฟรชหน้าแล้วขึ้น 404:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## บัญชีสำหรับทดลอง

| Username | Password | Role |
|---|---|---|
| (ใส่ของคุณ) | (ใส่ของคุณ) | standard |
| (ใส่ของคุณ) | (ใส่ของคุณ) | premium |

หรือสมัครบัญชีใหม่เองได้ที่หน้า Sign up

---

## ข้อจำกัด

- รหัสผ่านถูกเก็บและตรวจฝั่ง client เพราะใช้ MockAPI ไม่เหมาะกับการใช้งานจริง
- MockAPI แบบฟรีจำกัดจำนวน resource และจำนวน record
- ระบบ Premium เป็นการจำลอง ไม่มีการชำระเงินจริง