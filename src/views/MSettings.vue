<script lang="ts">
import { IonContent, IonIcon, IonButton } from '@ionic/vue'
import { add } from 'ionicons/icons'
import { defineComponent, inject } from 'vue'
import { useMPlayerStore } from '@/store'
import { v4 as uuid } from 'uuid'
import { FilePicker } from '@robingenz/capacitor-file-picker'
import ISong from '@/models/ISong'
import Storage from '@/api/storage'

export default defineComponent({
  components: {
    IonContent,
    IonIcon,
    IonButton,
  },
  setup() {
    const mplayer = useMPlayerStore()
    const emitter: any = inject('emitter')

    const addSongs = async () => {
      try {
        const result = await FilePicker.pickFiles({
          types: ['audio/*'],
          multiple: true,
          readData: true,
        })

        let songs: ISong[] = []

        result.files.map((file) => {
          const names = file.name.split('.mp3')[0].split('-')
          songs.push({
            id: 'song-' + uuid(),
            title: names[1].trim(),
            artist: names[0].trim(),
            path: 'data:audio/x-mp3;base64,' + file.data,
            selected: false,
            tags: [],
            cover:
              'https://cdn.dribbble.com/users/3547568/screenshots/14395014/media/0b94c75b97182946d495f34c16eab987.jpg?compress=1&resize=400x300&vertical=top',
            date: new Date(),
          })
        })

        mplayer.storeSongs(songs)
        await Storage.setSongs(songs)
      } catch (err) {
        console.error('Error: ' + err)
      }
    }

    return {
      add,
      addSongs,
      mplayer,
      emitter,
      Storage,
    }
  },
})
</script>

<template>
  <ion-content>
    <div id="MSettings">
      <ion-button class="add-songs" color="primary" @click="addSongs">
        <ion-icon :icon="add" />
        <span> Add songs </span>
      </ion-button>
      <div class="cores">
        <h3>Nightcore {{ mplayer.settings.nightcore }}%</h3>
        <input
          v-model="mplayer.settings.nightcore"
          @input="
            () => {
              emitter.emit('updateRate')
              Storage.saveSettings(mplayer.settings)
            }
          "
          type="range"
          min="1"
          max="100"
        />
        <h3>Lowcore {{ mplayer.settings.lowcore }}%</h3>
        <input
          v-model="mplayer.settings.lowcore"
          @input="
            () => {
              emitter.emit('updateRate')
              Storage.saveSettings(mplayer.settings)
            }
          "
          type="range"
          min="1"
          max="50"
        />
      </div>

      <div class="dj-mode">
        <h3>DJ Mode 😎</h3>
        <div>
          Song starts at:
          <input
            v-model="mplayer.settings.songStarts"
            @input="Storage.saveSettings(mplayer.settings)"
            type="number"
            min="0"
            max="100"
          />
          %
        </div>
        <div>
          Song ends at:
          <input
            v-model="mplayer.settings.songEnds"
            @input="Storage.saveSettings(mplayer.settings)"
            type="number"
            min="0"
            max="100"
          />
          %
        </div>
      </div>

      <div class="mix-mode">
        <h3>MIX Mode 🧬</h3>
        <div>
          Delay:
          <input
            v-model="mplayer.settings.mixMode"
            @input="Storage.saveSettings(mplayer.settings)"
            type="number"
            min="0"
            max="100"
          />
          seconds
        </div>
      </div>
    </div>
  </ion-content>
</template>

<style lang="scss">
#MSettings {
  padding: 20px;
  background: black;
  color: white;
  height: 100%;

  h3 {
    margin-top: 20px !important;
  }

  input[type='number'] {
    padding: 5px;
    width: 50px;
    color: black;
  }

  input[type='range'] {
    width: 80%;
  }

  .add-songs {
    width: 100%;
    height: 70px;
  }

  .cores {
    text-align: center;
  }

  .dj-mode,
  .mix-mode {
    text-align: center;
    div {
      padding: 10px;
    }
  }
}
</style>
