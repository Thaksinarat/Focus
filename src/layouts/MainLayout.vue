<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <NavbarMain></NavbarMain>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import NavbarMain from '@/components/NavbarMain.vue';
</script>