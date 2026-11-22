<template>
  <q-page class="q-pa-lg">
    <div class="text-h4 text-weight-bold q-mb-xs">Settings</div>

    <!-- Profile -->
    <q-card flat bordered class="q-mb-md">
      <q-card-section>
        <div class="text-h6 text-weight-bold">
          <q-icon name="fa-solid fa-address-book" class="q-mr-sm"></q-icon>
          Profile
        </div>
        <div class="text-caption text-grey-7">Manage your account information</div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-subtitle2 q-mb-sm">Name</div>
        <div class="row items-center no-wrap q-gutter-sm">
          <q-input
            v-model="nameInput"
            outlined
            dense
            class="col username-input"
            :readonly="!editingName"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-user" color="grey-9" size="20px"></q-icon>
            </template>
          </q-input>

          <!-- ปุ่นดินสอแก้ชื่อ -->
          <q-btn
            v-if="!editingName"
            flat
            round
            icon="fa-solid fa-pencil"
            size="10px"
            @click="editingName = true"
          ></q-btn>

          <!-- ปุ่ม confirm การเปลี่ยนชื่อ -->
          <q-btn
            v-else
            flat
            round
            icon="fa-solid fa-check"
            color="positive"
            :loading="savingName"
            @click="saveName"
          ></q-btn>

          <!-- ปุ่มยกเลิกเปลี่ยนชื่อ -->
          <q-btn
            v-if="editingName"
            flat
            round
            icon="fa-solid fa-xmark"
            color="red"
            @click="cancelName"
          ></q-btn>
        </div>

        <q-separator class="q-my-lg" />

        <!-- Password -->
        <div class="text-subtitle2 q-mb-sm">Change Password</div>
        <q-input
          v-model="currentPassword"
          outlined
          dense
          placeholder="Current Password"
          :type="showCurrent ? 'text' : 'password'"
          @keyup.enter="verifyPassword"
        >
          <template v-slot:prepend>
            <q-icon name="fa-solid fa-lock" color="grey-9" size="20px"></q-icon>
          </template>
          <template v-slot:append>
            <q-icon
              :name="showCurrent ? 'fa-regular fa-eye-slash' : 'fa-solid fa-eye'"
              class="cursor-pointer"
              @click="showCurrent = !showCurrent"
            >
            </q-icon>
          </template>
        </q-input>

        <q-btn
          label="Confirm Password"
          color="blue-2"
          text-color="dark"
          unelevated
          class="q-mt-md"
          :loading="checkingPassword"
          @click="verifyPassword"
        ></q-btn>

        <!-- กล่องกรอกรหัสใหม่ -->
        <div v-if="passwordVerified" class="q-mt-lg">
          <q-input
            v-model="newPassword"
            outlined
            dense
            placeholder="New Password"
            :type="showNew ? 'text' : 'password'"
            class="q-mb-md"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-key" color="grey-9" size="20px"></q-icon>
            </template>
            <template v-slot:append>
              <q-icon
                :name="showNew ? 'fa-regular fa-eye-slash' : 'fa-solid fa-eye'"
                class="cursor-pointer"
                @click="showNew = !showNew"
              ></q-icon>
            </template>
          </q-input>

          <q-input
            v-model="confirmPassword"
            outlined
            dense
            placeholder="Confirm New Password"
            :type="showConfirm ? 'text' : 'password'"
          >
            <template v-slot:prepend>
              <q-icon name="fa-solid fa-check" color="green" size="20px"></q-icon>
            </template>
            <template v-slot:append>
              <q-icon
                :name="showConfirm ? 'fa-regular fa-eye-slash' : 'fa-solid fa-eye'"
                class="cursor-pointer"
                @click="showConfirm = !showConfirm"
              ></q-icon>
            </template>
          </q-input>

          <q-btn
            label="Save New Password"
            color="grey-9"
            unelevated
            class="q-mt-md"
            :loading="savingPassword"
            @click="savePassword"
          >
          </q-btn>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered class="q-mb-md">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold">
            <q-icon name="fa-solid fa-crown" color="amber-8" class="q-mr-sm"> </q-icon>Premium
            Membership
          </div>
          <div class="text-caption text-grey-7">
            {{
              authStore.role === 'premium' ? 'You are a Premium Member' : 'You are a Free Member'
            }}
          </div>
        </div>

        <q-btn
          v-if="authStore.role === 'premium'"
          label="Cancel Premium"
          color="red"
          outline
          :loading="cancellingPremium"
          @click="confirmCancelPremium"
        ></q-btn>

        <q-badge v-else color="grey-6" label="Free Member"> </q-badge>
      </q-card-section>
    </q-card>

    <!-- Logout btn -->
    <q-card flat bordered class="q-mt-md">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold">Logout</div>
          <div class="text-caption text-grey-7">Sign out of your account</div>
        </div>

        <q-btn
          label="Logout"
          icon="fa-solid fa-right-from-bracket"
          color="red"
          unelevated
          @click="logout"
        ></q-btn>
      </q-card-section>
    </q-card>

    <!-- ลบบัญชี -->
    <q-card flat bordered class="q-mt-md bg-red-2">
      <q-card-section class="row items-center justify-between">
        <div>
          <div class="text-subtitle1 text-weight-bold">Delete account</div>
          <div class="text-caption text-grey-7">Delete your account and all your data</div>
        </div>
        <q-btn label="Delete" color="negative" outline :loading="deleting" @click="confirmDelete" />
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import { getUserById } from '@/services/auth.service'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const authStore = useAuthStore()
const router = useRouter()
const $q = useQuasar()

const userId = computed(() => authStore.user?.id)

const notifyOk = (message) => $q.notify({ type: 'positive', message, position: 'top' })
const notifyErr = (message) => $q.notify({ type: 'negative', message, position: 'top' })

// ---------- Premium ----------
const cancellingPremium = ref(false)

const confirmCancelPremium = () => {
  $q.dialog({
    title: 'Cancel Premium',
    message: 'Are you sure you want to cancel Premium package?',
    persistent: true,
    ok: { label: 'Confirm', color: 'red' },
    cancel: { label: 'Keep Premium', flat: true, color: 'black'  },
  }).onOk(() => cancelPremium())
}

const cancelPremium = async () => {
  if (authStore.role !== 'premium') {
    notifyErr('This account is not premium.')
    return
  }
  try {
    cancellingPremium.value = true
    await authStore.updateProfile({ role: 'standard' })
    notifyOk('Canceled package!')
  } catch (error) {
    console.error(error)
    notifyErr(`Sorry, Can't cancel premium package.`)
  } finally {
    cancellingPremium.value = false
  }
}

// ---------- Logout ----------
const logout = () => {
  authStore.logout()
  router.push('/sign-in')
}

// ---------- Name ----------
const nameInput = ref(authStore.user?.name || '')
const editingName = ref(false)
const savingName = ref(false)

const saveName = async () => {
  if (!nameInput.value.trim()) {
    notifyErr('Input your name')
    return
  }
  try {
    savingName.value = true
    await authStore.updateProfile({ name: nameInput.value.trim() })
    nameInput.value = authStore.user.name
    editingName.value = false
    notifyOk('changed name!')
  } catch (error) {
    console.error(error)
    notifyErr(`Can't change name, Try again.`)
  } finally {
    savingName.value = false
  }
}

const cancelName = () => {
  nameInput.value = authStore.user?.name || ''
  editingName.value = false
}

// ---------- Password ----------
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordVerified = ref(false)
const checkingPassword = ref(false)
const savingPassword = ref(false)

const showCurrent = ref(false)
const showNew = ref(false)
const showConfirm = ref(false)

// ตรวจรหัสผ่านเดิมกับข้อมูลใน api
const verifyPassword = async () => {
  if (!currentPassword.value) {
    notifyErr('please input Password')
    return
  }
  try {
    checkingPassword.value = true
    const { data } = await getUserById(userId.value)
    if (data.password === currentPassword.value) {
      passwordVerified.value = true
    } else {
      passwordVerified.value = false
      notifyErr('Password incorrect.')
    }
  } catch (error) {
    console.error(error)
    notifyErr(`Can't check password, Try again.`)
  } finally {
    checkingPassword.value = false
  }
}

const savePassword = async () => {
  if (!newPassword.value || !confirmPassword.value) {
    notifyErr('Incorrect password, please type more.')
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    notifyErr('Incorrect password')
    return
  }
  if (newPassword.value === currentPassword.value) {
    notifyErr('You input old password.')
    return
  }
  try {
    savingPassword.value = true
    await authStore.updateProfile({ password: newPassword.value })
    notifyOk('Changed password!')

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
    passwordVerified.value = false
  } catch (error) {
    console.error(error)
    notifyErr('Change Password failed, Try again.')
  } finally {
    savingPassword.value = false
  }
}

// ---------- ลบบัญชี ----------
const deleting = ref(false)
const confirmDelete = () => {
  $q.dialog({
    title: 'Delete account',
    message: 'This Account and data will delete forever, Are you sure to delete?',
    persistent: true,
    ok: { label: `I'm really sure!`, color: 'negative' },
    cancel: { label: 'Cancel', flat: true, color: 'black' },
  }).onOk(async () => {
    try {
      deleting.value = true
      await authStore.deleteAccount()
      router.push('/sign-in')
    } catch (error) {
      console.error(error)
      notifyErr('Delete account failed!')
    } finally {
      deleting.value = false
    }
  })
}
</script>
