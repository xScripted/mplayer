<script lang="ts">
import { useMPlayerStore } from '@/store'
import { IonContent, IonList, IonItem } from '@ionic/vue'
import { defineComponent, inject } from 'vue'
import ISong from '@/models/ISong'
import ITag from '@/models/ITag'

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

      if (timeDiff < 300) {
        if (mplayer.modeBuilder) {
          mplayer.applyTagsToSong(song.id)
          emitter.emit('show-alert', `📚 Tags applied to: ${song.title}`)
        } else {
          emitter.emit('buildSong', index)
        }
      } else {
        mplayer.addSongToQueue(song)
        emitter.emit('show-alert', `📣 ${song.title} - added to queue!`)
      }
    }

    const findTag = (tagId: string) =>
      mplayer.tags.find((tag: ITag) => tag.id === tagId)

    return {
      mplayer,
      emitter,
      startClick,
      endClick,
      findTag,
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
          <div>
            <div class="title">{{ song.title }}</div>
            <div class="artist">{{ song.artist }}</div>
          </div>
          <div class="song-tag-balls">
            <div
              v-for="tagId in song.tags"
              :key="tagId"
              class="tag-ball"
              :style="{ background: findTag(tagId)?.bgColor }"
            />
          </div>
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
  display: grid;
  grid-template-columns: 5fr 3fr;

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

  .song-tag-balls {
    .tag-ball {
      float: right;
      width: 12px;
      height: 12px;
      margin: 2px;
      border-radius: 100%;
    }
  }
}
</style>
