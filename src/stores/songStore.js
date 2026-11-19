
import { defineStore } from "pinia";
import { computed,ref } from "vue";
import {
  getUserDataByUserId as getById,
  createUserData as createData,
  updateUserData as updateData,
  deleteUserData as deleteData,
} from '@/services/user-data.service'

export function extractVideo(url = '') {
  const music = String(url).match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/,
  )
  // หาlink
  return music ? music[1] : null
}

export const useSongStore = defineStore('song', () => {
  const songs = ref([])
  const loading = ref(false)
  const currentId = ref(null)
  const isPlaying = ref(false)
  const userId = ref('1')

  const currentIndex = computed(() => songs .value.findIndex((s) => s.id === currentId.value))
  const currentSong = computed(() => songs.value[currentIndex.value] ?? null)

const fetchSongs= async() => {
    loading.value = true
    try {
      const { data } = await getById(userId.value)
      songs.value = data
    } catch (err) {
      if (err?.response?.status === 404) songs.value = []
      else throw err
    } finally {
      loading.value = false
    }
  }

  const addSong= async({ name, url }) => {
    const { data } = await createData({
      name: name.trim(), url: url.trim(), userId: userId.value, isFavorite: false,
    })
    songs.value.push(data)
  }

  const updateSong = async (id, { name, url }) => {
  const song = songs.value.find((s) => s.id === id)
  if (!song) return
  const { data } = await updateData(id, { ...song, name: name.trim(), url: url.trim() })
  Object.assign(song, data)
  }

  const removeSong = async (id) => {
  await deleteData(id)
  const idx = songs.value.findIndex((s) => s.id === id)
  if (idx !== -1) songs.value.splice(idx, 1)

  const wasCurrent = id === currentId.value
  if (wasCurrent) {
    currentId.value = null
    isPlaying.value = false
  }
  return wasCurrent
  }

  const toggleFavorite = async(song) => {
    const old = song.isFavorite
    song.isFavorite = !old
    try { await updateData(song.id, { ...song }) }
    catch (err) { song.isFavorite = old; throw err }
  }

  function select(id) { currentId.value = id }

  const step = async(dir) =>  {
    const name = songs.value.length
    if (!name) return
    const base = currentIndex.value === -1 ? (dir > 0 ? -1 : 0) : currentIndex.value
    currentId.value = songs.value[(base + dir + name) % name].id
  }

  function setPlaying(v) { isPlaying.value = v}

  return { songs, loading, currentId, isPlaying, userId, currentIndex, currentSong, fetchSongs, addSong, updateSong, removeSong, toggleFavorite, select, step, setPlaying, }
})
