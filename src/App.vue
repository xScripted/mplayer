<script lang="ts">
import { IonApp } from '@ionic/vue'
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions'
import { defineComponent, onMounted, provide } from 'vue'
import { useMPlayerStore } from '@/store'
import { useRoute } from 'vue-router'

import mitt from 'mitt'
import Storage from '@/api/storage'
import usePlayer from '@/services/usePlayer'
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
    const { player } = usePlayer(emitter)

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

      const songs = await Storage.getMetaSongs()
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
        <component :is="Component" />
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

  input {
    border: 0;
    background-color: rgb(235, 235, 235);
    color: black;
    border-radius: 5px;
  }
}

.tag {
  transition: 0.3s ease;
  border-radius: 6px;
  width: 100%;
  min-height: 40px;
  padding: 5px;
  font-size: 15px;
  box-shadow: 0 0 5px 0 black;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.active {
    transition: 0.3s ease;
    border: 2px solid black;
    transform: skewY(-6deg) scale(0.9);
  }
  &.unactive {
    transition: 0.3s ease;
    opacity: 0.5;
    transform: scale(0.7);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
