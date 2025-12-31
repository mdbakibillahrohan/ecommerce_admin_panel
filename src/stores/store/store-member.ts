import { defineStore } from 'pinia'
import { ref } from 'vue'

export function useStoreMemberStore() {
  return defineStore('storeMember', () => {
    const member = ref()

    const getMember = () => {}

    const createMember = () => {}

    const updateMember = () => {}

    const deleteMember = () => {}

    return {
      member,
      getMember,
      createMember,
      updateMember,
      deleteMember,
    }
  })()
}
