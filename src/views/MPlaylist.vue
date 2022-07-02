<script lang="ts">
import { useMPlayerStore } from '@/store'
import { IonContent, IonList, IonItem } from '@ionic/vue'
import { defineComponent, inject } from 'vue'
import ISong from '@/models/ISong'

export default defineComponent({
  components: {
    IonList,
    IonItem,
    IonContent,
  },
  setup() {
    const mplayer = useMPlayerStore()
    const emitter: any = inject('emitter')
    let startTime: any = new Date()

    const startClick = () => (startTime = new Date())

    const endClick = (song: ISong, index: number) => {
      const endTime: any = new Date()
      const timeDiff = endTime - startTime // ms

      if (timeDiff < 300) emitter.emit('buildSong', index)
      else {
        mplayer.addSongToQueue(song)
        emitter.emit('show-alert', `📣 ${song.title} - added to queue!`)
      }
    }

    return {
      mplayer,
      emitter,
      startClick,
      endClick,
    }
  },
})
</script>

<template>
  <ion-content>
    <ion-list>
      <ion-item
        v-for="(song, index) in mplayer.songsFilter"
        :key="song.id"
        @mousedown="startClick()"
        @mouseup="endClick(song, index)"
      >
        <div class="song" :class="{ selected: song.selected }">
          <div class="title">{{ song.title }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
      </ion-item>
    </ion-list>
  </ion-content>
</template>

<style lang="scss" scoped>
ion-content {
  --ion-background-color: rgb(12, 12, 12);
}
.song {
  margin-bottom: 5px;
  width: 100%;

  &.selected {
    font-weight: bold;
    font-style: italic;
    background-image: -webkit-linear-gradient(
      214deg,
      rgb(25, 0, 255),
      rgba(255, 0, 206, 1)
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .title {
    padding: 5px;
    color: white;
    text-align: left;
  }
  .artist {
    font-size: 12px;
    color: rgb(205, 167, 255);
    padding: 5px;
    padding-top: 0px;
    text-align: left;
  }
}
</style>
