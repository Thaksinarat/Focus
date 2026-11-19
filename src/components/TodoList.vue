<template>
  <div class="q-mt-md q-pa-md q-pb-lg">
    <!-- ส่วนหัว + ปุ่มเพิ่ม task -->
    <div class="row items-center justify-between q-mb-md q-px-lg">
      <div class="text-h5 text-weight-bold">
        <q-icon name="fa-solid fa-list-check" size="sm" class="q-mr-md"></q-icon>My tasks
      </div>
      <div class="flex">
        <q-btn
          color="accent"
          text-color="black"
          icon="fa-solid fa-add"
          label="New"
          unelevated
          rounded
          :disable="loading"
          @click="openAddDialog()"
        />
      </div>
    </div>

    <!-- ส่วนแสดง task -->
    <div class="q-pa-md">
      <!-- กำลังโหลด -->
      <div v-if="loading" class="text-center">
        <q-spinner-bars color="accent" size="md"></q-spinner-bars>
        <div class="text-grey-7 q-mt-xs">Loading tasks...</div>
      </div>

      <!-- ถ้าโหลดเสร็จแล้ว -->
      <div v-else>
        <!-- ตัวกรอง -->
        <q-option-group v-model="panel" inline :options="option" class="q-mb-md" color="accent" />
        <!-- ถ้ากรองแล้วไม่เจองาน -->
        <div v-if="filterTasks.length === 0" class="text-center q-gutter-md q-pa-lg text-grey-7">
          <q-icon size="md" :name="emptyMessage[panel].icon"></q-icon>
          <div>
            <p>{{ emptyMessage[panel].massage }}</p>
          </div>
        </div>
        <!-- ถ้าเจองาน -->
        <div v-else class="row q-col-gutter-md">
          <div v-for="task in filterTasks" :key="task.id" class="col-12 col-sm-6 col-md-3">
            <q-card flat class="bg-secondary" :class="{ done: task.status }">
              <!-- ส่วน checkbox และ title -->
              <q-card-section>
                <div class="row items-start">
                  <q-checkbox
                    :model-value="task.status"
                    dense
                    color="accent"
                    class="q-mr-sm q-mt-xs"
                    @update:model-value="onToggle(task.id)"
                  />
                  <div class="text-h6 text-weight-bold" :class="{ 'text-strike': task.status }">
                    {{ task.title }}
                  </div>
                </div>
              </q-card-section>
              <!-- ส่วน detail -->
              <q-card-section>
                <div :class="{ 'text-strike': task.status }">
                  {{ task.detail }}
                </div>
              </q-card-section>
              <!-- ปุ่มแก้ไข+ลบ -->
              <q-card-section class="q-gutter-sm">
                <q-btn
                  flat
                  rounded
                  dense
                  icon="fa-solid fa-pen"
                  label="edit"
                  size="sm"
                  class="q-pa-sm"
                  @click="openEditDialog(task)"
                />
                <q-btn
                  flat
                  rounded
                  dense
                  icon="fa-solid fa-trash"
                  label="delete"
                  size="sm"
                  color="negative"
                  class="q-pa-sm"
                  @click="onDelete(task)"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- dialog -->
  <q-dialog v-model="isOpen" persistent>
    <q-card style="min-width: 340px; max-width: 90vw">
      <!-- ส่วนหัว -->
      <q-card-section class="bg-accent">
        <div>
          <p class="text-h5">{{ isEditId ? 'Edit task' : 'Add Task' }}</p>
          <p class="text-subtitle2">{{ isEditId ? 'Edite your task.' : 'Create a new task.' }}</p>
        </div>
      </q-card-section>
      <!-- ส่วนฟอร์ม -->
      <q-form @submit.prevent="onSubmit">
        <!-- ช่อง input -->
        <q-card-section class="q-gutter-sm">
          <q-input
            v-model="form.title"
            label="title"
            outlined
            autofocus
            rounded
            color="black"
            :rules="[(value) => !!value?.trim() || 'Please Enter title.']"
          ></q-input>
          <q-input
            v-model="form.detail"
            label="detail"
            type="textarea"
            outlined
            rounded
            color="black"
            autogrow
          ></q-input>
        </q-card-section>

        <!-- ปุ่ม -->
        <q-card-section class="column items-end">
          <div>
            <q-btn
              flat
              rounded
              label="close"
              unelevated
              :disable="isSaving"
              @click="closeDialog"
            ></q-btn>
            <q-btn
              rounded
              label="save!"
              color="black"
              text-color="white"
              unelevated
              :loading="isSaving"
              type="submit"
            ></q-btn>
          </div>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<style>
/* ถ้างานเสร็จแล้วให้ค่าความโปร่งใส 0.5 */
.done {
  opacity: 0.5;
}
</style>

<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useTaskStore } from '@/stores/taskStore'
import { storeToRefs } from 'pinia'

const $q = useQuasar()
const taskStore = useTaskStore()
const { tasks, loading } = storeToRefs(taskStore)

// option-group
const panel = ref('all')
// option การกรองงาน
const option = [
  { label: 'All Tasks', value: 'all' },
  { label: 'Not done', value: 'not_done' },
  { label: 'Done', value: 'done' },
]
// ข้อความเมื่อเปิด panel แล้วไม่มีงาน
const emptyMessage = {
  all: { icon: 'fa-solid fa-note-sticky', massage: "You don't have any tasks to do." },
  not_done: { icon: 'fa-solid fa-circle-check', massage: 'Everything is done! 🎉' },
  done: { icon: 'fa-solid fa-circle-xmark', massage: 'No completed tasks yet.' },
}
// กรองงาน
const filterTasks = computed(() => {
  if (panel.value === 'done') {
    // ถ้า panel มีค่า done
    return tasks.value.filter((t) => t.status)
  } else if (panel.value === 'not_done') {
    // ถ้า panel มีค่า not_done
    return tasks.value.filter((t) => !t.status)
  }
  // ถ้าไม่ใช่ (panel มีค่าเป็น all)
  return tasks.value
})

// ดึงข้อมูลของ user (!!!!! จำลองเฉย ๆ ยังไม่ได้ทำ authStore ที)
onMounted(() => {
  // taskStore.fetchTasks(authStore.user.id)
  taskStore.fetchTasks('1')
})

// Dialog เพิ่ม/แก้ไข task
// เปิด/ปิด dialog
const isOpen = ref(false)
// กำลังบันทึกไหม
const isSaving = ref(false)
// ข้อมูลของ task
const form = reactive({ title: '', detail: '' })
// ค่า id ของ task ที่กำลังแก้
const isEditId = ref(null)

// function เปิด dialog
const openAddDialog = () => {
  // ให้ค่า isEditId = null ทุกครั้ง
  isEditId.value = null
  // reset ค่า ก่อนเปิดทุกครั้ง
  form.title = ''
  form.detail = ''
  // เปิด
  isOpen.value = true
}

// function เปิด dialog แก้ไข
const openEditDialog = (task) => {
  isEditId.value = task.id
  form.title = task.title
  form.detail = task.detail
  isOpen.value = true
}

// function ปิด dialog
const closeDialog = () => {
  isOpen.value = false
}

// function submit
const onSubmit = async () => {
  isSaving.value = true
  try {
    const data = {
      title: form.title.trim(),
      detail: form.detail?.trim() ?? '',
    }
    // เช็คว่าเป็นโหมดเพิ่ม / แก้ไข
    if (isEditId.value) {
      // แก้ไข
      await taskStore.editTask(isEditId.value, data)
      $q.notify({
        type: 'positive',
        message: 'Updated your task!',
        position: 'top-right',
      })
    } else {
      // เพิ่ม
      await taskStore.addTask(data)
      $q.notify({
        type: 'positive',
        message: 'added a new task!',
        position: 'top-right',
      })
    }
    // ปิด dialog
    closeDialog()
  } catch (error) {
    console.log('onSubmit (add/edit) error: ', error)
    $q.notify({
      type: 'negative',
      message: 'Oop! Try to save again!',
      position: 'top-right',
    })
  } finally {
    isSaving.value = false
  }
}

// function delete ลบ task
const onDelete = (task) => {
  $q.dialog({
    title: `🔺Delete: ${task.title}`,
    message: 'Do you want to delete this task, right?',
    cancel: {
      label: 'cancel',
      rounded: true,
      unelevated: true,
      size: 'md',
      textColor: 'black',
      color: 'white',
    },
    ok: {
      label: 'Delete!',
      color: 'negative',
      rounded: true,
      unelevated: true,
      size: 'md',
    },
    persistent: true,
    class: 'q-pa-xs',
  }).onOk(async () => {
    try {
      await taskStore.deleteTask(task.id)
      $q.notify({
        type: 'positive',
        message: 'deleted!',
        position: 'top-right',
      })
    } catch (error) {
      console.log('onDelete (task) Error: ', error)
      $q.notify({
        type: 'negative',
        message: 'Oop! Try to delete again!',
        position: 'top-right',
      })
    }
  })
}

// function สลับสถานะ
const onToggle = async (taskId) => {
  try {
    await taskStore.toggleStatus(taskId)
  } catch (error) {
    console.log('onToggle (task) Error: ', error)
    $q.notify({
      type: 'negative',
      message: 'Oop! Try to update status again!',
      position: 'top-right',
    })
  }
}
</script>
