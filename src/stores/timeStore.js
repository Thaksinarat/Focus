import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeStore = defineStore("timeStore", () => {
    // state
    const defaultFocus = ref(1500)
    const deepFocus = ref(1800)
    const customFocus = ref(0)
    // get
    // action
    // return
    return{defaultFocus, deepFocus, customFocus}
})