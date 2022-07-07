<script lang="ts">
import { IonIcon, IonButton } from '@ionic/vue'
import { defineComponent, ref, computed } from 'vue'
import { useRoute } from 'vue-router'

import { search, caretUp, trashOutline } from 'ionicons/icons'
import { useMPlayerStore } from '@/store'

type orderByOptions = 'ASC' | 'DESC' | 'NONE'

export default defineComponent({
  components: {
    IonIcon,
    IonButton,
  },

  setup() {
    const route = useRoute()
    const fullHeight = ref(false)
    const mplayer = useMPlayerStore()

    const isPlaylist = computed(() => route.name === 'Playlist')

    const options = {
      NONE: 'ASC',
      ASC: 'DESC',
      DESC: 'NONE',
    }

    const clearOrders = () => {
      mplayer.orderBy.title = 'NONE'
      mplayer.orderBy.artist = 'NONE'
      mplayer.orderBy.date = 'NONE'
    }

    const clearAll = () => {
      clearOrders()
      mplayer.filterText = ''
      mplayer.filterSongs()
    }

    const orderByTitle = () => {
      const index = mplayer.orderBy.title as orderByOptions
      clearOrders()
      mplayer.orderBy.title = options[index]
      mplayer.orderByType('title')
    }

    const orderByArtist = () => {
      const index = mplayer.orderBy.artist as orderByOptions
      clearOrders()
      mplayer.orderBy.artist = options[index]
      mplayer.orderByType('artist')
      console.log(mplayer.orderBy.artist)
    }

    const orderByDate = () => {
      const index = mplayer.orderBy.date as orderByOptions
      clearOrders()
      mplayer.orderBy.date = options[index]
      mplayer.orderByType('date')
    }

    return {
      search,
      route,
      fullHeight,
      isPlaylist,
      mplayer,
      orderByTitle,
      orderByArtist,
      orderByDate,
      caretUp,
      trashOutline,
      clearAll,
    }
  },
})
</script>

<template>
  <div
    id="MHeader"
    :class="{
      fullHeight: fullHeight && isPlaylist,
      builder: mplayer.modeBuilder,
    }"
  >
    <div class="header">
      <router-link :to="{ name: 'Playlist' }">
        <div class="logo" :class="{ builder: mplayer.modeBuilder }">
          <h1>MPlayer</h1>
        </div>
      </router-link>
      <div v-if="isPlaylist">
        <ion-icon @click="fullHeight = !fullHeight" :icon="search" />
      </div>
    </div>
    <div class="header-content">
      <div class="playlist-buttons">
        <div class="searcher">
          <input
            type="text"
            v-model="mplayer.filterText"
            @input="mplayer.filterSongs()"
            placeholder="Search for a song..."
          />

          <ion-icon @click="clearAll" :icon="trashOutline" />
        </div>

        <div class="order-buttons">
          <ion-button @click="orderByTitle">
            Title
            <ion-icon
              v-if="mplayer.orderBy.title != 'NONE'"
              class="order-icon"
              :class="{ 'rotate-it': mplayer.orderBy.title === 'DESC' }"
              :icon="caretUp"
            />
          </ion-button>

          <ion-button @click="orderByArtist">
            Artist
            <ion-icon
              v-if="mplayer.orderBy.artist != 'NONE'"
              class="order-icon"
              :class="{ 'rotate-it': mplayer.orderBy.artist === 'DESC' }"
              :icon="caretUp"
            />
          </ion-button>

          <ion-button @click="orderByDate">
            Date
            <ion-icon
              v-if="mplayer.orderBy.date != 'NONE'"
              class="order-icon"
              :class="{ 'rotate-it': mplayer.orderBy.date === 'DESC' }"
              :icon="caretUp"
            />
          </ion-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
#MHeader {
  transition: 0.3s ease;
  position: absolute;
  background-color: black;
  color: white;
  width: 100%;
  height: 60px;
  padding: 0 20px;
  z-index: 8;
  overflow: hidden;

  &.fullHeight {
    height: max-content;
  }

  &.builder {
    background-image: -webkit-linear-gradient(
      214deg,
      rgb(25, 0, 255),
      rgba(255, 0, 206, 1)
    );
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 60px;
  }

  .header-content {
    padding-bottom: 20px;

    .searcher {
      display: flex;

      input {
        padding: 10px;
        border-radius: 7px;
        width: 100%;
        color: black;
      }

      ion-icon {
        padding: 10px 20px;
        font-size: 30px;
      }
    }

    .order-buttons {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      margin-top: 20px;

      .order-icon {
        padding-left: 5px;
        transition: 0.3s ease;
        transform-origin: 70% 55%;

        &.rotate-it {
          transition: 0.3s ease;
          transform: rotate(180deg);
        }
      }
    }
  }

  .icon {
    background: rgb(255, 0, 255);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  a {
    text-decoration: none;
  }

  .logo {
    display: flex;
    color: rgb(255, 255, 255);

    h1 {
      margin: 0 5px;
      font-size: 20px;
      font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS',
        sans-serif;
    }

    &:not(.builder) {
      background-image: -webkit-linear-gradient(
        170deg,
        rgb(96, 78, 255),
        rgba(255, 0, 206, 1)
      );
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
</style>
