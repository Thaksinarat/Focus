<template>
  <q-page class="flex flex-center q-pa-md">
    <q-card flat bordered class="q-pa-lg text-center" style="max-width: 420px; width: 100%">
      <q-icon name="fa-solid fa-crown" color="amber-8" size="48px" class="q-mb-md" />
      <div class="text-h5 text-weight-bold">Premium Member</div>
      <div class="text-grey-7 q-mt-sm">
        Thank you for subscription our Premium pakage {{ authStore.user?.name }}
      </div>

      <q-list class="q-mt-md text-left">
        <q-item>
          <q-item-section avatar><q-icon name="fa-solid fa-music" color="positive" /></q-item-section>
          <q-item-section>Can play song from YouTube with PlayBar</q-item-section>
        </q-item>
        <q-item>
          <q-item-section avatar><q-icon name="fa-solid fa-heart" color="pink" /></q-item-section>
          <q-item-section>Can add your favorite song to your fav-list</q-item-section>
        </q-item>
      </q-list>

      <q-btn class="q-mt-lg" label="กลับหน้าแรก" color="accent" text-color="dark" unelevated rounded to="/" />
    </q-card>
  </q-page>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
</script>