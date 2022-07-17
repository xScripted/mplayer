<script lang="ts">
import { useMPlayerStore } from '@/store'
import {
  defineComponent,
  inject,
  ref,
  Ref,
  onMounted,
  watchEffect,
  reactive,
} from 'vue'
import ISong from '@/models/ISong'
import ITag from '@/models/ITag'
import { add, close, brush } from 'ionicons/icons'
import { IonIcon, IonButton } from '@ionic/vue'
import Storage from '@/api/storage'

export default defineComponent({
  components: {
    IonIcon,
    IonButton,
  },
  setup() {
    const mplayer = useMPlayerStore()
    const emitter: any = inject('emitter')
    const isForm = ref(false)

    const clickSong = (song: ISong, index: number) => {
      if (mplayer.modeBuilder) {
        mplayer.applyTagsToSong(song.id)
        emitter.emit('show-alert', `📚 Tags applied to: ${song.title}`)
      } else {
        emitter.emit('buildSong', index)
      }
    }

    const pagedSongs: Ref<ISong[]> = ref([])
    let page = 1

    const askMoreSongs = () => {
      const pageSize = page * 50
      pagedSongs.value = mplayer.songsFilter.filter(
        (song: ISong, i: number) => i <= pageSize
      )
    }

    const findTag = (tagId: string) =>
      mplayer.tags.find((tag: ITag) => tag.id === tagId)

    onMounted(() => {
      askMoreSongs()
      const divContainer = document.getElementById('MPlaylist')
      divContainer?.addEventListener('scroll', () => {
        if (
          divContainer.offsetHeight + divContainer.scrollTop >=
          divContainer.scrollHeight
        ) {
          ++page
          askMoreSongs()
        }
      })
    })

    watchEffect(() => {
      page = 1
      askMoreSongs()
    })

    let div: any
    let size = 0
    let dy = 0
    let isDone = false
    const setSwipe = (ev: any) => {
      dy = ev.touches[0].clientY
      div = ev.target
      while (!div?.classList.contains('song')) div = div.parentNode
    }

    const swipeRight = (ev: any) => {
      const dy2 = ev.touches[0].clientY
      if (dy2 > dy - 20 && dy2 < dy + 20) {
        if (size === 40) {
          isDone = true
        } else {
          div.children[0].children[0].style.width = size++ + 'px'
        }
      }
    }

    const resetSwipe = (ev: Event, song: ISong) => {
      div.children[0].children[0].style.width = 0
      div = null
      size = 0
      if (isDone) {
        if (mplayer.modeBuilder) {
          isForm.value = true
          formData.id = song.id
          formData.title = song.title
          formData.artist = song.artist
          formData.cover = song.cover
        } else {
          mplayer.addSongToQueue(song)
          emitter.emit('show-alert', `📣 ${song.title} - added to queue!`)
          isDone = false
        }
      }
    }

    const formData = reactive({
      id: '',
      title: '',
      artist: '',
      cover: '',
    })

    const updateSong = () => {
      mplayer.updateSong(formData)
      Storage.setMetaSongs(mplayer.songs)
      isForm.value = false
    }

    const deleteSong = () => {
      mplayer.deleteSong(formData.id)
      Storage.setMetaSongs(mplayer.songs)
      isForm.value = false
    }

    return {
      mplayer,
      emitter,
      clickSong,
      findTag,
      pagedSongs,
      swipeRight,
      resetSwipe,
      setSwipe,
      add,
      close,
      brush,
      isForm,
      formData,
      updateSong,
      deleteSong,
    }
  },
})
</script>

<template>
  <div
    id="MPlaylist"
    :style="isForm ? `background-image: url(${formData.cover})` : ''"
  >
    <div v-if="isForm" class="edit-song-form">
      <ion-icon class="close-form" @click="isForm = false" :icon="close" />
      <div class="input-group">
        <label for="tag-name"> Title </label>
        <input id="tag-name" v-model="formData.title" type="text" />
      </div>
      <div class="input-group">
        <label for="tag-text-color"> Artist </label>
        <input id="tag-text-color" v-model="formData.artist" type="text" />
      </div>
      <div class="input-group">
        <label for="tag-grad1"> Cover </label>
        <input id="tag-grad1" v-model="formData.cover" type="text" />
      </div>
      <div class="update-buttons">
        <ion-button @click="updateSong"> Update </ion-button>
        <ion-button @click="deleteSong" color="danger"> Delete </ion-button>
      </div>
    </div>

    <div
      v-else
      v-for="(song, index) in pagedSongs"
      :key="song.id"
      @click="clickSong(song, index)"
      @touchstart="setSwipe"
      @touchmove="swipeRight"
      @touchend="resetSwipe($event, song)"
      lines="none"
      class="song"
      :class="{ selected: song.selected }"
    >
      <div class="song-left">
        <div class="swipe-banner">
          <ion-icon v-if="mplayer.modeBuilder" :icon="brush" />
          <ion-icon v-else :icon="add" />
        </div>
        <div>
          <div class="title">{{ song.title }}</div>
          <div class="artist">{{ song.artist }}</div>
        </div>
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
  </div>
</template>

<style lang="scss" scoped>
#MPlaylist {
  background-size: cover;
  background-position: center;
  background-color: rgb(24, 0, 51);
  overflow-y: scroll;
  height: 100%;

  .song {
    display: grid;
    grid-template-columns: 5fr 3fr;

    margin-bottom: 5px;
    width: 100%;

    .song-left {
      display: flex;
      .swipe-banner {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background-image: -webkit-linear-gradient(
          214deg,
          rgb(25, 0, 255),
          rgba(255, 0, 206, 1)
        );
        height: 100%;
        width: 0;

        ion-icon {
          position: absolute;
          font-size: 20px;
        }
      }

      .title {
        padding: 5px;
        padding-left: 10px;
        font-size: 14px;
        color: white;
        text-align: left;
      }
      .artist {
        font-size: 12px;
        color: rgb(205, 167, 255);
        padding: 5px;
        padding-left: 10px;
        padding-top: 0px;
        text-align: left;
      }
    }

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
    .song-tag-balls {
      padding-right: 10px;
      .tag-ball {
        float: right;
        width: 12px;
        height: 12px;
        margin: 2px;
        border-radius: 100%;
      }
    }
  }

  .edit-song-form {
    display: grid;
    padding: 10px;

    .close-form {
      height: 50px;
      display: inline-flex;
      justify-self: end;
      font-size: 25px;
    }

    .input-group {
      display: flex;
      flex-direction: column;

      label {
        padding: 10px 0;
        text-align: center;
      }

      input {
        border-radius: 5px;
        width: 100%;
        color: black;
      }

      input[type='text'] {
        padding: 10px;
      }

      input[type='color'] {
        width: 100%;
        height: 40px;
      }
    }

    .update-buttons {
      display: flex;
      flex-direction: column;

      ion-button {
        height: 50px;
        margin-top: 20px;
      }
    }
  }
}
</style>
