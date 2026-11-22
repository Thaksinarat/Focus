import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useUserDataStore } from '@/stores/userDataStore'

export function extractVideo(url = '') {
  const music = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/,
  )
  // หาลิงก์
  return music ? music[1] : null
}

export const useSongStore = defineStore('song', () => {
  const dataStore = useUserDataStore()

  const songs = computed(() => dataStore.songs)
  const loading = computed(() => dataStore.loading)
  const currentId = ref(null)
  const isPlaying = ref(false)

  const currentIndex = computed(() => songs.value.findIndex((s) => s.id === currentId.value))
  const currentSong = computed(() => songs.value[currentIndex.value] ?? null)

  // โหลดเพลงของ user และล้างเพลงของ user คนก่อนหน้า
  const fetchSongs = async (userId) => {
    currentId.value = null
    isPlaying.value = false
    await dataStore.load(userId)
  }

  // เพิ่มเพลง
  const addSong = async ({ name, url }) => {
    dataStore.songs.push({
      id: Date.now(),
      name: name.trim(),
      url: url.trim(),
      isFavorite: false,
    })
    await dataStore.save()
  }

  // แก้ไขเพลง
  const updateSong = async (id, { name, url }) => {
    const song = dataStore.songs.find((s) => s.id === id)
    if (!song) return
    song.name = name.trim()
    song.url = url.trim()
    await dataStore.save()
  }

  // ลบเพลง
  const removeSong = async (id) => {
    dataStore.songs = dataStore.songs.filter((s) => s.id !== id)

    const wasCurrent = id === currentId.value
    if (wasCurrent) {
      currentId.value = null
      isPlaying.value = false
    }
    await dataStore.save()
    return wasCurrent
  }

  // สลับสถานะ
  const toggleFavorite = async (song) => {
    const old = song.isFavorite
    song.isFavorite = !old
    try {
      await dataStore.save()
    } catch (err) {
      song.isFavorite = old
      throw err
    }
  }

  // เลือกเพลงที่จะเล่น
  function select(id) { currentId.value = id }

  // เปลี่ยนเพลง
  const step = async (dir) => {
    const count = songs.value.length
    if (!count) return
    const base = currentIndex.value === -1 ? (dir > 0 ? -1 : 0) : currentIndex.value
    currentId.value = songs.value[(base + dir + count) % count].id
  }

  // สั่งเล่น
  function setPlaying(v) { isPlaying.value = v }

  return {
    songs, loading, currentId, isPlaying, currentIndex, currentSong,
    fetchSongs, addSong, updateSong, removeSong, toggleFavorite, select, step, setPlaying,
  }
})