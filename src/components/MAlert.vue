<script lang="ts">
import { defineComponent, inject, ref } from 'vue'

export default defineComponent({
  setup() {
    const emitter: any = inject('emitter')
    const theme = ref('')
    const message = ref('')
    const showAlert = ref(false)

    emitter.on('show-alert', (newMessage: string, newTheme = '') => {
      theme.value = newTheme
      message.value = newMessage
      showAlert.value = true

      setTimeout(() => (showAlert.value = false), 2000)
    })

    return {
      message,
      theme,
      showAlert,
    }
  },
})
</script>

<template>
  <transition name="fade">
    <div v-if="showAlert" class="MAlert" :class="theme">
      <span> {{ message }} </span>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.MAlert {
  position: absolute;
  z-index: 10;
  padding: 20px;
  background: rgba(41, 41, 41, 0.7);
  color: white;
  width: 80%;
  top: 20px;
  left: 0;
  right: 0;
  margin: auto;
  box-shadow: 0 0 5px 0px rgb(0, 0, 0);
  border-radius: 10px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
