<template>
  <q-page class="login-page flex flex-center q-pa-md">
    <q-card class="login-card q-pa-lg">
      <q-card-section class="text-center">
        <q-avatar size="65px" color="blue-1" text-color="primary" class="q-mb-md">
          <q-icon class="fa-solid fa-user-plus" color="grey-9" size="32px" />
        </q-avatar>
        <div class="text-h4 text-weight-bold text-grey-9">Create account</div>
        <div class="text-grey-6 q-mt-sm">Sign up to start using Focus</div>
      </q-card-section>

      <q-card-section>
        <q-form @submit.prevent="onRegister">
          <q-input
            v-model="name"
            placeholder="Name"
            outlined
            :rules="[(val) => !!val?.trim() || 'Please enter your name']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-id-card" color="grey-9" size="20px" />
            </template>
          </q-input>

          <q-input
            v-model="username"
            placeholder="Username"
            outlined
            :rules="[(val) => (!!val?.trim() && val.length >= 6) || 'Username must be at least 6 characters']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-user-pen" color="grey-9" size="20px" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            placeholder="Password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            lazy-rules
            :rules="[(val) => (val && val.length >= 6) || 'Password must be at least 6 characters']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-lock" color="grey-9" size="20px" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'fa-solid fa-eye' : 'fa-regular fa-eye-slash'"
                color="grey-9"
                class="cursor-pointer"
                size="16px"
                @click="showPassword = !showPassword"
              />
            </template>
          </q-input>

          <q-input
            v-model="confirm"
            placeholder="Confirm password"
            :type="showPassword ? 'text' : 'password'"
            outlined
            lazy-rules
            :rules="[(val) => val === password || 'Passwords do not match']"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-lock" color="grey-9" size="20px" />
            </template>
          </q-input>

          <q-btn
            type="submit"
            icon="fa-solid fa-user-plus"
            label="Sign up"
            color="accent"
            text-color="dark"
            class="full-width q-mt-md"
            size="20px"
            unelevated
            :loading="authStore.loading"
            :disable="!name || !username || !password || !confirm"
          />
        </q-form>
      </q-card-section>

      <q-banner v-if="authStore.errorMessage" class="bg-red-1 text-negative q-mt-sm" rounded>
        {{ authStore.errorMessage }}
      </q-banner>

      <div class="text-center q-mt-md">
        Already have an account? <router-link to="/sign-in">Sign in</router-link>
      </div>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const name = ref('')
const username = ref('')
const password = ref('')
const confirm = ref('')
const showPassword = ref(false)

// ล้าง error ที่ค้างมาจากหน้าอื่น
onMounted(() => {
  authStore.errorMessage = ''
})

const onRegister = async () => {
  try {
    await authStore.register({
      name: name.value.trim(),
      username: username.value.trim(),
      password: password.value,
    })
    router.push('/')
  } catch (error) {
    console.error('Register failed: ', error)
  }
}
</script>