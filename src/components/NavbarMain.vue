<template>
  <div class="bg-accent q-pa-sm">
    <div class="row justify-between items-center">
      <!-- ตั้งค่า -->
      <q-btn
        color="primary"
        unelevated
        round
        text-color="black"
        @click="isSettingPage ? goBack() : goToSetting()"
      >
        <q-icon :name="isSettingPage ? 'fa-solid fa-arrow-left' : 'fa-solid fa-gear'" size="xs" />
      </q-btn>
      <!--ปุ่ม Premium + หน้า premium -->
      <div>
        <q-btn
          v-if="authStore.role !== 'premium'"
          label="สมัคร Premium"
          icon="fa-solid fa-crown"
          color="amber-3"
          text-color="brown-9"
          unelevated
          rounded
          :loading="authStore.loading"
          :disable="authStore.loading"
          @click="upgradePremium"
        >
        </q-btn>

        <q-btn
          v-else
          label="Premium Member"
          icon="fa-solid fa-crown"
          color="amber-3"
          text-color="brown-9"
          unelevated
          rounded
          disable
        ></q-btn>

        <q-btn
          v-if="!isAuthPage && authStore.role === 'premium'"
          class="q-ml-md"
          round
          unelevated
          size="xs"
          color="black"
          icon="fa-solid fa-info"
          @click="toPremiumPage()"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { useQuasar } from 'quasar'

const route = useRoute()
const authStore = useAuthStore()
const $q = useQuasar()

const upgradePremium = async () => {
  try {
    await authStore.upgradeToPremium()
    $q.notify({
      type: 'positive',
      message: 'สมัคร Premium สำเร็จ!',
      position: 'top',
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.message || 'ไม่สามารถสมัคร Premium ได้สำเร็จ!',
      position: 'top',
    })
  }
}

const isSettingPage = computed(() => {
  return route.path === '/settings'
})

// เรียกใช้ Router
const router = useRouter()

// ไปหน้า setting
const goToSetting = () => {
  router.push('/settings')
}

// ย้อนกลับ
const goBack = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}

// ไป premiumpage
const toPremiumPage = () => {
  router.push('/premium')
}
</script>
