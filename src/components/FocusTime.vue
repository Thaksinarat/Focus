<template>
  <q-page padding>
    <!-- Header -->
    <div class="text-center q-mb-xl">
      <p class="text-h3">Focus</p>
      <p class="text-subtitle1">Pick the right time and focus your task!</p>
    </div>
    <!-- แสดงเวลานับถอยหลัง -->
    <div class="text-center">
      <div>
        <p class="text-h1">{{ formatTime }}</p>
        <p class="q-ml-md text-h5">mins</p>
      </div>
    </div>

    <div class="flex flex-center q-gutter-lg">
      <!-- ปุ่มเริ่ม/หยุด -->
      <div class="text-center">
        <q-btn
          @click="toggleTimer()"
          unelevated
          rounded
          :color="isRunning ? 'secondary' : 'accent'"
          text-color="text-font-light"
          :label="isRunning ? 'Stop' : 'Start'"
          size="xl"
          class="q-px-lg"
        />
      </div>
      <!-- ปุ่มรีเซ็ท -->
      <div class="text-center">
        <q-btn
          @click="resetTimer()"
          unelevated
          rounded
          color="primary"
          text-color="text-font-light"
          label="reset"
          size="xl"
          class="q-px-lg"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useTimeStore } from '@/stores/timeStore'
import { useQuasar } from 'quasar'

// create time store
const timeStore = useTimeStore()

// create Q
const $q = useQuasar()

// timer
const defaultFocus = timeStore.defaultFocus
const timeLeft = ref(defaultFocus)
const isRunning = ref(false)
let timerInterval = null

// แปลงวินาทีให้เป็นรูปแบบ mm:ss
const formatTime = computed(() => {
  // แปลงนาที
  const minutes = Math.floor(timeLeft.value / 60)
  // แปลงวินาที
  const second = timeLeft.value % 60
  const paddedMinutes = String(minutes).padStart(2, '0')
  const paddedSeconds = String(second).padStart(2, '0')
  return `${paddedMinutes}:${paddedSeconds}`
})

// สลับการทำงาน
const toggleTimer = () => {
  if (isRunning.value) {
    stopTimer()
  } else {
    startTimer()
  }
}

// start
const startTimer = () => {
  if (timeLeft.value <= 0) return
  // กำลังเล่น = จริง
  isRunning.value = true
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      stopTimer()
      $q.notify({
        type: 'negative',
        message: 'Time out!',
        icon: 'clock',
      })
    }
  }, 1000)
}

// stop
const stopTimer = () => {
  // สั่งให้หยุดนับถอยหลัง
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

// reset
const resetTimer = () => {
  stopTimer()
  timeLeft.value = defaultFocus
}

onUnmounted(() => {
  stopTimer()
})

console.log(timeStore.deepFocus)
</script>
