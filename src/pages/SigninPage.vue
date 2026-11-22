<template>
  <q-page class="login-page flex flex-center q-pa-md">
    <q-card class="login-card q-pa-lg">
      <q-card-section class="text-center">
        <q-avatar size="65px" color="blue-1" text-color="primary" class="q-mb-md">
          <q-icon
            class="fa-solid fa-user"
            color="grey-9"
            :class="$q.dark.isActive ? 'white' : 'primary'"
            size="32px"
          />
        </q-avatar>

        <div class="text-h4 text-weight-bold text-grey-9">Welcome to Focus!</div>

        <div class="text-grey-6 q-mt-sm">Sign in to continue to Focus</div>
      </q-card-section>

      <!-- ฟอร์ม login -->
      <!-- input user -->
      <q-card-section>
        <q-form @submit.prevent="onLogin">
          <q-input
            v-model="username"
            placeholder="Username"
            outlined
            :rules="[(val) => !!val || 'Please enter your username']"
          >
            <template v-slot:prepend>
              <q-icon
                name="fa-solid fa-user-pen"
                color="grey-9"
                :class="$q.dark.isActive ? 'white' : 'primary'"
                size="20px"
              ></q-icon>
            </template>
          </q-input>

          <!-- input password -->
          <q-input
            v-model="password"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            lazy-rules
            :rules="[(val) => !!val || 'Please enter your password']"
          >
            <template v-slot:prepend>
              <q-icon
                name="fa-solid fa-lock"
                color="grey-9"
                :class="$q.dark.isActive ? 'white' : 'primary'"
                size="20px"
              ></q-icon>
            </template>

            <!-- ส่วนของเปิด-ปิดการมองเห็น Password -->
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'fa-solid fa-eye' : 'fa-regular fa-eye-slash'"
                color="grey-9"
                class="cursor-pointer"
                :class="$q.dark.isActive ? 'white' : 'primary'"
                size="16px"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <!-- btn login -->
          <q-btn
            type="submit"
            icon="fa-solid fa-right-to-bracket"
            label="Login"
            color="accent"
            text-color="dark"
            class="full-width q-mt-md"
            :class="$q.dark.isActive ? 'white' : 'primary'"
            size="20px"
            unelevated
            :loading="authStore.loading"
            :disable="!username || !password"
          ></q-btn>
        </q-form>
      </q-card-section>

      <!-- แสดง Error -->
      <q-banner v-if="authStore.errorMessage" class="bg-red-1 text-negative q-mt-sm" rounded>
        {{ authStore.errorMessage }}</q-banner
      >

      <!-- ถ้ายังไม่มี account ให้สมัครใหม่ -->
      <div class="text-center q-mt-md">
        Don't have an account? <router-link to="/sign-up">Sign up</router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const router = useRouter()

// สร้าง store
const authStore = useAuthStore()

// ตัวแปรฟอร์ม
const username = ref('')
const password = ref('')
const showPassword = ref(false)

// function login
const onLogin = async () => {
  try {
    await authStore.login(username.value, password.value)

    // login สำเร็จให้เปลี่ยนไป home page
    router.push('/')
  } catch (error) {
    console.error('Login failed: ', error)
  }
}

// ล้างค่า errMag
onMounted(() => {
  authStore.errorMessage = ''
})
</script>
