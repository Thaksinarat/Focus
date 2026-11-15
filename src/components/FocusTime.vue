<template>
  <div class="q-mt-lg q-mb-lg">
    <!-- Header -->
    <div class="text-center">
      <p class="text-h3 text-weight-bold">Focus</p>
      <p class="text-subtitle1">Pick the right time and focus your task! ✨</p>
    </div>

    <!-- ปุ่มเลือกเวลา -->
    <div class="text-center q-mb-md">
      <!-- 25 Mins -->
      <q-btn
        class="q-mx-xs"
        unelevated
        rounded
        color="secondary"
        text-color="text-font-light"
        @click="setTime(1500)"
        >25 Mins</q-btn
      >
      <!-- 30 Mins -->
      <q-btn
        class="q-mx-xs"
        unelevated
        rounded
        color="secondary"
        text-color="text-font-light"
        @click="setTime(1800)"
        >30 Mins</q-btn
      >
      <!-- custom -->
      <q-btn
        class="q-mx-xs"
        unelevated
        rounded
        color="secondary"
        text-color="text-font-light"
        @click="openDialog()"
        >Customs</q-btn
      >
    </div>
    <!-- แสดงเวลานับถอยหลัง -->
    <div class="text-center">
      <div>
        <p class="text-h1">{{ formatTime }}</p>
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

    <!-- dialog -->
    <q-dialog v-model="isOpen" persistent>
      <q-card style="min-width: 340px; max-width: 90vw">
        <!-- ส่วนหัว -->
        <q-card-section class="bg-accent">
          <div>
            <p class="text-h5">Customs time</p>
            <p class="text-subtitle2">How long do you want to focus?</p>
          </div>
        </q-card-section>
        <!-- ส่วนฟอร์ม -->
        <q-form @submit.prevent="onSubmit(customTime)">
          <!-- ช่อง input -->
          <q-card-section class="q-gutter-md">
            <!-- นาที -->
            <div class="col-6">
              <q-input
                v-model.number="customMinutes"
                type="number"
                label="minutes"
                outlined
                autofocus
                rounded
                color="black"
              ></q-input>
            </div>
            <!-- วินาที -->
            <div class="col-6">
              <q-input
                v-model.number="customSeconds"
                type="number"
                label="seconds"
                outlined
                rounded
                color="black"
              ></q-input>
            </div>
          </q-card-section>
          <!-- ปุ่ม -->
          <q-card-section class="column items-end">
            <div>
              <q-btn
                flat
                rounded
                label="close"
                unelevated
                @click="closeDialog()"
              ></q-btn>
              <q-btn
                rounded
                label="set!"
                color="black"
                text-color="white"
                unelevated
                type="submit"
              ></q-btn>
            </div>
          </q-card-section>
        </q-form>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'

// create Q
const $q = useQuasar()

// timer
const defaultFocus = ref(1500)
const timeLeft = ref(defaultFocus.value)
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
      $q.dialog({
        title: '🎉',
        message: `Let's take some rest and than focus on your work`,
        color: 'black',
        ok: {
          rounded: true,
          unelevated: true,
          size: 'md',
        },
        position: 'top',
        class: 'q-pa-md text-center',
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

// set time
const setTime = (time) => {
  stopTimer()
  // ตั้งค่าตัวจับเวลาให้เท่ากับค่า time
  defaultFocus.value = time
  // แสดงผลค่าที่เปลี่ยนไป
  timeLeft.value = time
}

// dialog custom time
// เปิด/ปิด dialog
const isOpen = ref(false)
// เวลาที่ตั้งค่า
const customMinutes = ref(0)
const customSeconds = ref(0)

// function เปิด Dialog
const openDialog = () => {
  customMinutes.value = 0
  customSeconds.value = 0
  isOpen.value = true
}
// function ปิด dialog
const closeDialog = () => {
  isOpen.value = false
}
// function onSubmit
const onSubmit = () => {
  const totalTime = customMinutes.value * 60 + customSeconds.value

  // ถ้าค่า น้อยกว่า 0
  if (totalTime <= 0) {
    $q.notify({
      type: 'warning',
      message: 'Time must be more than 0 seconds',
      position: 'bottom-right',
    })
    // ไม่ปิด dialog
    return
  }

  // ถ้าไม่ ให้ setTime
  setTime(totalTime)
  $q.notify({
    type: 'positive',
    message: 'Custom time completed!',
    position: 'bottom-right'
  })

  // ปิด dialog
  closeDialog()
}

// reset
const resetTimer = () => {
  stopTimer()
  timeLeft.value = defaultFocus.value
}

// เมื่อปิดให้หยุดนับถอยหลัง
onUnmounted(() => {
  stopTimer()
})
</script>
