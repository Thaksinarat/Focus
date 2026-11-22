<template>
  <q-layout view="lHh Lpr lFf">
    <q-header v-if="!isAuthPage">
      <NavbarMain></NavbarMain>
    </q-header>
    
    <q-page-container>
      <router-view />
    </q-page-container>

    <PlayBar v-if="!isAuthPage && authStore.role === 'premium'" />
  </q-layout>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import NavbarMain from '@/components/NavbarMain.vue';
import PlayBar from '@/components/PlayBar.vue';

const route = useRoute()
const authStore = useAuthStore()

const isAuthPage = computed(() => ['/sign-in', '/sign-up'].includes(route.path))
</script>