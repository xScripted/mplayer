<template>
  <ion-content>
    <div id="MPlayer">
      <div class="extra-bar">
        <ion-icon
          @click="switchLowcore"
          class="lowcore"
          :class="{ activated: mplayer.isLowcore }"
          :icon="rainy"
        />
        <ion-icon
          class="dj-mode"
          @click="mplayer.isDJMode = !mplayer.isDJMode"
          :class="{ activated: mplayer.isDJMode }"
          :icon="disc"
        />
        <ion-icon
          @click="switchNightcore"
          class="nightcore"
          :class="{ activated: mplayer.isNightcore }"
          :icon="sparkles"
        />
      </div>

      <div class="happy-box">
        <div
          :style="{ backgroundImage: `url(${mplayer.currentSong?.cover})` }"
        ></div>
      </div>

      <div class="song-data">
        <div class="title">
          {{ mplayer.currentSong?.title }}
        </div>
        <div class="artist">{{ mplayer.currentSong?.artist }}</div>
      </div>

      <div class="progress-bar-container" @click="selectSongMoment($event)">
        <div class="progress-bar">
          <div class="filled" :style="{ width: mplayer.dynamicWidth }" />
        </div>
      </div>

      <div class="player-bar">
        <ion-icon
          @click="switchShuffle"
          :class="{ activated: mplayer.isShuffle }"
          :icon="shuffle"
        />
        <ion-icon @click="emitter.emit('before')" :icon="chevronBack" />
        <ion-icon
          v-if="!mplayer.playing"
          @click="emitter.emit('play')"
          class="play-pause"
          :icon="playCircle"
        />
        <ion-icon
          v-else
          @click="emitter.emit('pause')"
          class="play-pause"
          :icon="pauseCircle"
        />
        <ion-icon @click="emitter.emit('next')" :icon="chevronForward" />
        <ion-icon
          @click="switchBucle"
          :class="{ activated: mplayer.isBucle }"
          :icon="reload"
        />
      </div>
    </div>
  </ion-content>
</template>

<script lang="ts">
import {
  playCircle,
  pauseCircle,
  chevronForward,
  chevronBack,
  shuffle,
  reload,
  disc,
  rainy,
  sparkles,
  volumeOff,
  volumeHigh,
} from 'ionicons/icons'
import { defineComponent, inject } from 'vue'
import { useMPlayerStore } from '@/store'
import { Howler } from 'howler'
import { IonIcon, IonContent } from '@ionic/vue'

export default defineComponent({
  components: {
    IonIcon,
    IonContent,
  },
  setup() {
    const mplayer = useMPlayerStore()
    const emitter: any = inject('emitter')

    const switchNightcore = () => {
      if (!mplayer.isNightcore) {
        mplayer.isNightcore = true
        mplayer.isLowcore = false
      } else {
        mplayer.isNightcore = false
      }

      emitter.emit('updateRate')
    }

    const switchLowcore = () => {
      if (!mplayer.isLowcore) {
        mplayer.isLowcore = true
        mplayer.isNightcore = false
      } else {
        mplayer.isLowcore = false
      }

      emitter.emit('updateRate')
    }

    const switchShuffle = () => {
      if (!mplayer.isShuffle) {
        mplayer.isShuffle = true
        mplayer.isBucle = false
        return
      }

      mplayer.isShuffle = false
    }

    const switchBucle = () => {
      if (!mplayer.isBucle) {
        mplayer.isBucle = true
        mplayer.isShuffle = false
        return
      }

      mplayer.isBucle = false
    }

    const selectSongMoment = (ev: any) => {
      if (Howler._howls.length > 0) {
        const songMoment =
          ((ev.clientX / window.innerWidth) *
            100 *
            Howler._howls[0].duration()) /
          100
        Howler._howls[0].seek(songMoment)
      }
    }

    return {
      songs: mplayer.songs,
      playCircle,
      pauseCircle,
      chevronForward,
      chevronBack,
      shuffle,
      reload,
      disc,
      rainy,
      sparkles,
      volumeOff,
      volumeHigh,
      mplayer,
      emitter,
      switchNightcore,
      switchLowcore,
      switchBucle,
      switchShuffle,
      selectSongMoment,
    }
  },
})
</script>

<style lang="scss" scoped>
#MPlayer {
  position: absolute;
  top: 0;
  width: 100%;
  z-index: 9;
  height: 100%;
  display: grid;
  grid-template-rows: 100px 1fr 100px 50px 130px;
  background: rgb(2, 0, 36);
  background: linear-gradient(
    214deg,
    rgba(2, 0, 36, 1) 0%,
    rgba(9, 9, 121, 1) 20%,
    rgba(255, 0, 206, 1) 100%
  );
  animation-name: fadex;
  animation-duration: 0.3s;

  ion-icon {
    color: white;

    &.activated {
      background-color: white;
      color: black;
      border-radius: 100%;
    }
  }

  .extra-bar {
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 30px;

    ion-icon {
      padding: 15px;
    }
  }

  .happy-box {
    position: relative;
    padding: 10px 30px;
    div {
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 10px;
    }
  }

  .song-data {
    width: 100%;
    margin: auto;
    text-align: center;

    .title {
      color: white;
      font-size: 20px;
    }
    .artist {
      font-size: 16px;
      font-weight: bold;
      color: rgba(0, 0, 0, 0.5);
    }
  }

  .progress-bar-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    .progress-bar {
      position: relative;
      top: 0;
      left: 0;
      right: 0;
      margin: auto;
      width: 80%;
      height: 10px;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 6px;
      overflow: hidden;

      .filled {
        position: absolute;
        height: 100%;
        border-radius: 6px;
        background-color: rgba(255, 255, 255, 0.9);
      }
    }
  }

  .player-bar {
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;

    ion-icon {
      font-size: 40px;
      padding: 7px;
    }

    .play-pause {
      font-size: 90px;
    }
  }
}

@keyframes fadex {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
