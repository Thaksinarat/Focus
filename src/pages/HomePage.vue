<!-- Home page -->
<template>
  <q-page :class="$q.dark.isActive ? 'bg-dark text-white' : 'bg-primary text-dark'">
    <FocusTime></FocusTime>
    <TodoList></TodoList>
  </q-page>
</template>

<script setup>
import { useQuasar } from 'quasar';
import FocusTime from '@/components/FocusTime.vue';
import TodoList from '@/components/TodoList.vue';

const $q = useQuasar()

</script>
