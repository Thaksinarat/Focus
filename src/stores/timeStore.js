import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeStore = defineStore("timeStore", () => {
    // state
    const defaultFocus = ref(25)
    const deepFocus = ref(30)
    const customFocus = ref(0)
    // get
    // action
    // return
    return{defaultFocus, deepFocus, customFocus}
})