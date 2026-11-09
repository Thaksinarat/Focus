import { defineStore } from "pinia";
import { ref } from "vue";

export const useTimeStore = defineStore("timeStore", () => {
    // state
    const defaultFocus = ref(1500)
    // get
    // action
    // return
    return{defaultFocus}
})