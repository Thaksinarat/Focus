<template>
  <q-footer bordered class="play-bar">
    <div ref="playerHost" class="yt-hidden" aria-hidden="true"></div>

    <q-toolbar class="q-px-sm">
      <div class="title-wrap col">
        <span
          ref="titleText"
          class="title-text text-subtitle2"
          :class="{ marquee: isOverflow }"
          :style="{ animationDuration: marqueeDuration }"
        >
          {{ currentSong?.name || `haven't select the song yet.` }}
        </span>
      </div>

      <q-btn
        flat
        round
        dense
        class="pb-btn"
        icon="fa-solid fa-backward-step"
        :disable="!songs.length"
        @click="skip(-1)"
      />

      <q-btn
        round
        class="pb-play q-mx-xs"
        :icon="isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play'"
        :disable="!songs.length"
        @click="togglePlay"
      />

      <q-btn
        flat
        round
        dense
        class="pb-btn"
        icon="fa-solid fa-forward-step"
        :disable="!songs.length"
        @click="skip(1)"
      />

      <q-btn
        flat
        round
        dense
        class="pb-btn q-ml-sm"
        :class="{ 'is-fav': currentSong?.isFavorite }"
        :icon="currentSong?.isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
        :disable="!currentSong"
        @click="onToggleFavorite(currentSong)"
      />

      <q-btn flat round dense class="pb-btn" icon="fa-solid fa-list" @click="listOpen = true" />
    </q-toolbar>
  </q-footer>

  <q-dialog v-model="listOpen" maximized transition-show="slide-up" transition-hide="slide-down">
    <q-card class="column no-wrap">
      <q-toolbar class="bg-grey-10 text-white">
        <q-toolbar-title>My songs</q-toolbar-title>
        <q-btn flat round dense icon="fa-solid fa-close" v-close-popup />
      </q-toolbar>

      <div class="q-pa-md q-gutter-y-sm">
        <q-input v-model="search" dense outlined clearable placeholder="Search...">
          <template #prepend><q-icon name="fa-solid fa-search" /></template>
        </q-input>
        <div class="row items-center justify-between">
          <q-btn-toggle
            v-model="filter"
            no-caps
            unelevated
            toggle-color="grey-10"
            :options="[
              { label: 'All', value: 'all' },
              { label: 'Favorite', value: 'favorite' },
            ]"
          />
          <q-btn
            rounded
            unelevated
            no-caps
            class="pill-btn"
            icon="fa-solid fa-plus"
            label="New song"
            @click="openAdd"
          />
        </div>
      </div>
      <q-separator />

      <q-scroll-area class="col">
        <div v-if="loading" class="flex flex-center q-pa-xl"><q-spinner size="32px" /></div>

        <div v-else-if="!songs.length" class="column items-center q-pa-xl text-grey-7">
          <q-icon name="fa-solid fa-music_off" size="48px" />
          <div class="q-mt-sm text-body1">Don't have any song, please new song.</div>
        </div>

        <div v-else-if="!filteredSongs.length" class="column items-center q-pa-xl text-grey-7">
          <q-icon name="fa-solid fa-search_off" size="48px" />
          <div class="q-mt-sm">Sorry, Don't found any song.</div>
        </div>

        <q-list v-else separator>
          <q-item
            v-for="song in filteredSongs"
            :key="song.id"
            clickable
            v-ripple
            :active="song.id === currentId"
            active-class="bg-grey-3 text-black"
            @click="onSelect(song)"
          >
            <q-item-section avatar>
              <q-icon
                :name="
                  song.id === currentId && isPlaying
                    ? 'fa-solid fa-chart-simple'
                    : 'fa-solid fa-music'
                "
              />
            </q-item-section>

            <q-item-section>
              <q-item-label lines="5">{{ song.name }}</q-item-label>
            </q-item-section>

            <q-item-section side>
              <div class="row no-wrap items-center">
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="fa-solid fa-pen"
                  color="grey-7"
                  @click.stop="openEdit(song)"
                />
                <q-btn
                  flat
                  round
                  dense
                  size="sm"
                  icon="fa-solid fa-trash"
                  color="negative"
                  @click.stop="askDelete(song)"
                />
                <q-btn
                  flat
                  round
                  dense
                  :icon="song.isFavorite ? 'fa-solid fa-heart' : 'fa-regular fa-heart'"
                  :color="song.isFavorite ? 'pink' : 'grey-7'"
                  @click.stop="onToggleFavorite(song)"
                />
              </div>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
    </q-card>
  </q-dialog>

  <q-dialog v-model="addOpen" persistent>
    <q-card class="add-card">
      <q-card-section class="text-h6">{{ isEdit ? 'Update song' : 'New song' }}</q-card-section>

      <q-form @submit.prevent="onSave">
        <q-card-section class="q-gutter-y-md">
          <q-input
            v-model="form.name"
            outlined
            rounded
            autofocus
            color="grey-10"
            label-color="grey-8"
            label="Song's name"
            :rules="[(v) => !!v?.trim() || 'Please enter some text.']"
          />
          <q-input
            v-model="form.url"
            outlined
            rounded
            color="grey-10"
            label-color="grey-8"
            label="YouTube Link"
            placeholder="https://www.youtube.com/watch?v=..."
            :rules="[
              (v) => !!v?.trim() || 'please enter youtube link.',
              (v) => !!extractVideo(v) || 'Link incorrect, Try again.',
            ]"
          />
        </q-card-section>

        <q-card-actions align="right" class="q-px-md q-pb-md">
          <q-btn
            rounded
            outline
            no-caps
            class="pill-outline"
            label="cancel"
            v-close-popup
            :disable="saving"
          />
          <q-btn
            rounded
            unelevated
            no-caps
            class="pill-btn"
            type="submit"
            label="save!"
            :loading="saving"
          />
        </q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
  <q-dialog v-model="deleteOpen" persistent>
    <q-card style="width: 380px; max-width: 90vw">
      <q-card-section class="text-h6">Delete</q-card-section>
      <q-card-section> Do you want to delete "{{ deleteTarget?.name }}"? </q-card-section>
      <q-card-actions align="right">
        <q-btn flat no-caps label="cancel" v-close-popup :disable="deleting" />
        <q-btn color="negative" no-caps label="delete" :loading="deleting" @click="onDelete" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { storeToRefs } from 'pinia'
import { useQuasar } from 'quasar'
import { useSongStore, extractVideo } from '@/stores/songStore'

// Premium
import { useAuthStore } from '@/stores/authStore'

const $q = useQuasar()
const store = useSongStore()
const { songs, loading, currentId, currentSong, isPlaying } = storeToRefs(store)
const authStore = useAuthStore()

const playerHost = ref(null)
let player = null
const playerReady = ref(false)

watch(
  () => authStore.role,
  (newRole) => {
    if (newRole !== 'premium') {
      if (playerReady.value) {
        player.stopVideo()
      }
      store.setPlaying(false)
    }
  },
)

//โหลดสคริป yt

function loadYouTubeApi() {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve()
    window.onYouTubeIframeAPIReady = resolve
    if (!document.getElementById('yt-iframe-api')) {
      const tag = document.createElement('script')
      tag.id = 'yt-iframe-api'
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
}

//สร้่างตัวเล่น
onMounted(async () => {
  store
    .fetchSongs(authStore.user.id)
    .catch(() => $q.notify({ type: 'negative', message: 'Loaded failed!, Try again.' }))

  await loadYouTubeApi()
  const el = document.createElement('div')
  playerHost.value.appendChild(el)

  player = new window.YT.Player(el, {
    width: '1',
    height: '1',
    playerVars: { playsinline: 1, controls: 0, rel: 0 },
    events: {
      onReady: () => {
        playerReady.value = true
        playCurrent()
      },
      onStateChange: (e) => {
        const S = window.YT.PlayerState
        if (e.data === S.PLAYING) store.setPlaying(true)
        else if (e.data === S.PAUSED) store.setPlaying(false)
        else if (e.data === S.ENDED) skip(1) // จบเพลง -> เพลงถัดไป
      },
      onError: () => {
        store.setPlaying(false)
        $q.notify({ type: 'warning', message: `Can't play this song, skiped next song.` })
        skip(1)
      },
    },
  })
})

onBeforeUnmount(() => player?.destroy())

//โหลดวิดิโอและเล่นมัน
function playCurrent() {
  if (authStore.role !== 'premium') {
    if (playerReady.value) player.stopVideo()
    store.setPlaying(false)
    return
  }
  const id = extractVideo(currentSong.value?.url)
  if (playerReady.value && id) player.loadVideoById(id)
}
watch(currentId, playCurrent)

function togglePlay() {
  if (authStore.role !== 'premium') {
    $q.notify({
      type: 'warning',
      message: 'For "Premium" member only. Join us premium.',
    })
    return
  }
  if (!currentSong.value) {
    store.step(1)
    return
  }
  if (!playerReady.value) return
  isPlaying.value ? player.pauseVideo() : player.playVideo()
}

function skip(dir) {
  const before = currentId.value
  store.step(dir)
  if (store.currentId === before && playerReady.value) {
    player.seekTo(0)
    player.playVideo()
  }
}

function onSelect(song) {
  if (song.id === currentId.value) togglePlay()
  else store.select(song.id)
}

async function onToggleFavorite(song) {
  if (!song) return
  try {
    await store.toggleFavorite(song)
  } catch {
    $q.notify({ type: 'negative', message: 'Save favorite song failed.' })
  }
}

const titleText = ref(null)
const isOverflow = ref(false)
const marqueeDuration = ref('10s')

async function checkOverflow() {
  isOverflow.value = false
  await nextTick()
  const el = titleText.value
  if (!el) return
  isOverflow.value = el.offsetWidth > el.parentElement.clientWidth
  marqueeDuration.value = `${Math.max(8, el.offsetWidth / 40)}s`
}

watch(() => currentSong.value?.name, checkOverflow, { flush: 'post' })
onMounted(() => {
  checkOverflow()
  window.addEventListener('resize', checkOverflow)
})
onBeforeUnmount(() => window.removeEventListener('resize', checkOverflow))

const listOpen = ref(false)
const search = ref('')
const filter = ref('all')

const filteredSongs = computed(() => {
  const q = (search.value || '').trim().toLowerCase()
  return songs.value.filter(
    (s) => (filter.value === 'all' || s.isFavorite) && (!q || s.name.toLowerCase().includes(q)),
  )
})

const addOpen = ref(false)
const saving = ref(false)
const form = ref({ name: '', url: '' })
const editingId = ref(null)
const isEdit = computed(() => editingId.value !== null)

function openAdd() {
  editingId.value = null
  form.value = { name: '', url: '' }
  addOpen.value = true
}

function openEdit(song) {
  editingId.value = song.id
  form.value = { name: song.name, url: song.url } // ใส่ค่าเดิมลงฟอร์ม
  addOpen.value = true
}

async function onSave() {
  saving.value = true
  try {
    if (isEdit.value) {
      const old = songs.value.find((s) => s.id === editingId.value)
      const urlChanged = old.url !== form.value.url.trim()
      await store.updateSong(editingId.value, form.value)
      // แก้ลิงก์ของเพลง
      if (urlChanged && editingId.value === currentId.value) playCurrent()
      $q.notify({ type: 'positive', message: 'updated song!' })
    } else {
      await store.addSong(form.value)
      $q.notify({ type: 'positive', message: 'Added new song!' })
    }
    addOpen.value = false
  } catch {
    $q.notify({ type: 'negative', message: 'save failed, Try again.' })
  } finally {
    saving.value = false
  }
}

const deleteOpen = ref(false)
const deleteTarget = ref(null)
const deleting = ref(false)

function askDelete(song) {
  deleteTarget.value = song
  deleteOpen.value = true
}

async function onDelete() {
  deleting.value = true
  try {
    const wasCurrent = await store.removeSong(deleteTarget.value.id)
    if (wasCurrent && playerReady.value) player.stopVideo() // ลบเพลงที่เล่นอยู่ -> หยุดเสียง
    deleteOpen.value = false
    $q.notify({ type: 'positive', message: 'deleted song' })
  } catch {
    $q.notify({ type: 'negative', message: 'delete failed, Try again.' })
  } finally {
    deleting.value = false
  }
}

// สั่งหยุดเพลงตอนหมดเวลา
function stopMusic() {
  if (!playerReady.value) return

  player.pauseVideo()
  store.setPlaying(false)
}

// หยุดเพลงเมื่อเวลาหมด
onMounted(() => {
  window.addEventListener('time-out', stopMusic)
})
onBeforeUnmount(() => {
  window.removeEventListener('time-out', stopMusic)
})
</script>

<style scoped>
.yt-hidden {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 1px;
  height: 1px;
  opacity: 0.01;
  pointer-events: none;
  overflow: hidden;
}

.play-bar {
  background: #212121 !important;
  color: #fcfdf4 !important;
}

/* ปุ่มทั่วไป: สีขาว */
.play-bar .pb-btn {
  color: #fcfdf4 !important;
}

/* หัวใจ: ชมพู */
.play-bar .pb-btn.is-fav {
  color: #f48fb1 !important;
}

/* ปุ่มเล่น/หยุด: พื้นขาว ไอคอนเข้ม */
.play-bar .pb-play {
  background: #fff !important;
  color: #212121 !important;
}

.title-wrap {
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  margin-right: 8px;
}
.title-text {
  display: inline-block;
}
.title-text.marquee {
  padding-left: 100%;
  animation: title-scroll linear infinite;
}
@keyframes title-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
}
@media (prefers-reduced-motion: reduce) {
  .title-text.marquee {
    animation: none;
    padding-left: 0;
  }
}

/* ปุ่มแคปซูล: พื้นเข้ม ตัวอักษรครีม */
.pill-btn {
  background: #212121 !important;
  color: #fcfdf4 !important;
}

.add-card {
  width: 420px;
  max-width: 90vw;
  border-radius: 24px;
  background: #fff !important;
  color: #212121 !important;
}

.add-card :deep(.q-field__native),
.add-card :deep(.q-field__input) {
  color: #212121 !important;
}
.add-card :deep(.q-field__label) {
  color: #616161 !important;
}
.add-card :deep(input::placeholder) {
  color: #9e9e9e;
}
.add-card :deep(.q-field--outlined .q-field__control:before) {
  border-color: #9e9e9e;
}
</style>
