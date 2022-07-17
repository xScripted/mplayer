<script lang="ts">
import { IonContent, IonIcon, IonButton } from '@ionic/vue'
import { add } from 'ionicons/icons'
import { defineComponent, inject } from 'vue'
import { useMPlayerStore } from '@/store'
import { v4 as uuid } from 'uuid'
import { FilePicker } from '@robingenz/capacitor-file-picker'
import ISong, { isSong } from '@/models/ISong'
import ITag, { isTag } from '@/models/ITag'
import Storage from '@/api/storage'
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem'

export default defineComponent({
  components: {
    IonContent,
    IonIcon,
    IonButton,
  },
  setup() {
    const mplayer = useMPlayerStore()
    const emitter: any = inject('emitter')

    // utils
    const onlyNewSongs = (newISongs: ISong[]) => {
      return newISongs.filter((song: ISong) =>
        mplayer.songs.every(
          (mpSong: ISong) =>
            mpSong.title !== song.title || mpSong.artist !== song.artist
        )
      )
    }

    const onlyNewTags = (newITags: ITag[]) => {
      return newITags.filter((tag: ITag) =>
        mplayer.tags.every((mpTag: ITag) => mpTag.name !== tag.name)
      )
    }

    const addSongs = async () => {
      try {
        const result = await FilePicker.pickFiles({
          types: ['audio/*'],
          multiple: true,
          readData: false,
        })

        let songs: ISong[] = []

        result.files.map((file) => {
          let names = file.name.split('.mp3')[0].split('-')
          if (names.length === 1) names = ['', file.name.split('.mp3')[0]]

          songs.push({
            id: 'song-' + uuid(),
            title: names[1]?.trim(),
            artist: names[0]?.trim(),
            path: file.name,
            selected: false,
            tags: [],
            cover: '',
            date: new Date(),
          })
        })

        songs = onlyNewSongs(songs)

        mplayer.storeSongs(songs)
        await Storage.setMetaSongs(mplayer.songs)
      } catch (err) {
        console.error('Error: ' + err)
      }
    }

    const uploadSongs = async () => {
      const result: any = await FilePicker.pickFiles({
        multiple: false,
        types: ['application/json'],
      })

      let data: ISong[] = JSON.parse(atob(result.files[0].data))
      if (data.every((el) => isSong(el))) {
        // Clear repeated songs
        data = onlyNewSongs(data)
        // Store new songs
        mplayer.storeSongs(data)
        await Storage.setMetaSongs(mplayer.songs)
        // Send feedback
        emitter.emit('show-alert', `🎉 ${data.length} songs imported!`)
      } else {
        emitter.emit('show-alert', `⛔ This json is not ISong[]`)
      }
    }

    const uploadTags = async () => {
      const result: any = await FilePicker.pickFiles({
        multiple: false,
        types: ['application/json'],
      })

      let data: ITag[] = JSON.parse(atob(result.files[0].data))
      if (data.every((el) => isTag(el))) {
        // Clear repeated songs
        data = onlyNewTags(data)
        // Store new songs
        mplayer.storeTags(data)
        await Storage.setTags(mplayer.tags)
        // Send feedback
        emitter.emit('show-alert', `🎉 ${data.length} tags imported!`)
      } else {
        emitter.emit('show-alert', `⛔ This json is not ITag[]`)
      }
    }

    const writeSecretFile = async (data: any, name: string) => {
      console.log(JSON.stringify(data))
      await Filesystem.writeFile({
        path: name + '.json',
        data: JSON.stringify(data),
        directory: Directory.Documents,
        encoding: Encoding.UTF8,
      })
      emitter.emit('show-alert', `Saved on Documents: <br>${name}.json`)
    }

    return {
      add,
      addSongs,
      mplayer,
      emitter,
      Storage,
      writeSecretFile,
      uploadSongs,
      uploadTags,
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

      <input
        v-model="mplayer.settings.folderPath"
        @input="Storage.saveSettings(mplayer.settings)"
        class="folder-path"
        type="text"
        placeholder="📂 Folder path"
      />

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

      <div class="exports-imports">
        <ion-button
          class="export-songs"
          color="primary"
          @click="
            writeSecretFile(mplayer.songs, mplayer.songs.length + '-songs')
          "
        >
          🎵 Export Songs
        </ion-button>
        <ion-button
          class="export-tags"
          color="primary"
          @click="writeSecretFile(mplayer.tags, mplayer.tags.length + '-tags')"
        >
          📚 Export Tags
        </ion-button>
        <ion-button class="export-tags" color="primary" @click="uploadSongs">
          🎵 Import Songs
        </ion-button>
        <ion-button class="export-tags" color="primary" @click="uploadTags">
          📚 Import Tags
        </ion-button>
      </div>
    </div>
  </ion-content>
</template>

<style lang="scss">
ion-content {
  --ion-background-color: rgb(24, 0, 51);
  * {
    color: white;
  }
}

#MSettings {
  padding: 20px;
  height: fit-content;

  h3 {
    margin-top: 20px !important;
  }

  input[type='number'] {
    padding: 5px;
    width: 50px;
  }

  input[type='range'] {
    width: 80%;
  }

  .add-songs {
    width: 100%;
    height: 40px;
  }

  .cores {
    text-align: center;
  }

  .folder-path {
    padding: 10px;
    width: 100%;
    margin: 5px 0;
  }

  .exports-imports {
    margin-top: 10px;
    display: grid;
    grid-gap: 5px;
    grid-template-columns: 1fr 1fr;
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
