<template>
  <q-page padding>
    <!-- menu เลือกเวลา -->
    <div class="q-pa-md q-gutter-sm">
      <q-btn
        unelevated
        rounded
        color="secondary"
        text-color="text-font-light"
        :label="timeStore.defaultFocus + ` mins`"
      />
      <q-btn
        unelevated
        rounded
        color="secondary"
        text-color="text-font-light"
        :label="timeStore.deepFocus + ` mins`"
      />
      <q-btn unelevated rounded color="secondary" text-color="text-font-light" label="custom" />
    </div>

    <!-- แสดงเวลานับถอยหลัง -->
    <div class="text-center">
      <p><span class="text-h1">09:13</span><span class="q-ml-md text-h5">mins</span></p>
    </div>

    <!-- ปุ่ม -->
    <div class="text-center">
      <q-btn unelevated rounded color="accent" text-color="text-font-light" label="Start" size="xl" class="q-px-lg" />
    </div>

    <!-- ภาพ -->
    <q-img src="/imgs/main_pic.png" alt="main" class="col-12 col-md-6" fit="contain"></q-img>
  </q-page>
</template>

<script setup>
import { useTimeStore } from '@/stores/timeStore'

// create time store
const timeStore = useTimeStore()

console.log(timeStore.deepFocus)
</script>
