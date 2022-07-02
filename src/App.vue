<script lang="ts">
import { IonApp } from '@ionic/vue'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
import { defineComponent, onMounted, provide } from 'vue'
import { useMPlayerStore } from '@/store'
import { useRoute } from 'vue-router'

import mitt from 'mitt'
import Storage from '@/api/storage'
import useMusic from '@/services/useMusic'
import MTabs from '@/components/MTabs.vue'
import MPlayerLite from '@/components/MPlayerLite.vue'
import MHeader from '@/components/MHeader.vue'
import MAlert from '@/components/MAlert.vue'

export default defineComponent({
  components: {
    IonApp,
    MTabs,
    MPlayerLite,
    MHeader,
    MAlert,
  },
  setup() {
    const emitter = mitt()
    const route = useRoute()
    const { player } = useMusic()

    // Providers
    provide('emitter', emitter)

    emitter.on('buildSong', (song: any) => player.buildSong(song))

    emitter.on('before', () => player.before())
    emitter.on('play', () => player.play())
    emitter.on('pause', () => player.pause())
    emitter.on('next', () => player.next())

    emitter.on('updateRate', () => player.updateRate())

    onMounted(async () => {
      const mplayer = useMPlayerStore()

      AndroidPermissions.requestPermissions([
        AndroidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
      ])

      const songs = await Storage.getSongs()
      const settings = Storage.getSettings()
      const tags = Storage.getTags()

      if (settings) mplayer.settings = settings
      mplayer.storeSongs(songs)
      mplayer.storeTags(tags)
    })

    return { route }
  },
})
</script>

<template>
  <ion-app>
    <m-alert />
    <m-header />
    <div class="full" :class="{ routes: route.name !== 'Player' }">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
    <div :style="{ zIndex: route.name === 'Player' ? -1 : 6 }" class="controls">
      <m-player-lite />
      <m-tabs />
    </div>
  </ion-app>
</template>

<style lang="scss">
.full {
  margin-top: 60px;
  transition: 0.01s;
  height: 100%;
}

.routes {
  transition: 0.01s;
  height: calc(100% - 190px);
}

body {
  background: black;
  color: white;
  user-select: none;

  * {
    font-family: 'Rubik';
  }
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
