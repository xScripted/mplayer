import ISong from '@/models/ISong'
import { useMPlayerStore } from '@/store'
import { Howler, Howl } from 'howler'
import { Capacitor } from '@capacitor/core'

const usePlayer = (emitter: any) => {
  const mplayer = useMPlayerStore()
  const lastSongs: ISong[] = []
  let index = 0


  const player = {
    async buildSong(i: number) {
      index = i
      // fade out last song
      letDieSong()
      // Reset selected song
      mplayer.songs.map((song: ISong) => song.selected = false)

      // Set currentSong data
      mplayer.currentSong = mplayer.songsFilter[i]
      //const songId = mplayer.currentSong.id
      const URL = Capacitor.convertFileSrc(mplayer.settings.folderPath + mplayer.currentSong.path) // mplayer.currentSong.path

      Howler._howls[0] = new Howl({
        src: [URL],
        rate: 1,
        volume: 1,
        html5: false,
        onplay() {
          mplayer.playing = true
          mplayer.songsFilter[index].selected = true

          player.updateRate()
          
          if(mplayer.isDJMode) {
            const newBeginning = mplayer.settings.songStarts * Howler._howls[0].duration() / 100
            Howler._howls[0].seek(newBeginning)
          }
          
          Howler._howls[0].fade(0, 1, mplayer.settings.mixMode * 1000)
        },
        onloaderror(id: any, err: any) {
          emitter.emit('show-alert',`❌ ${err} <br> ${URL}`)
          console.error('Load Error', id, err, URL)
        },
        onplayerror(id: any, err: any) {
          emitter.emit('show-alert',`❌ ${err} <br> ${URL}`)
          console.error('Play Error', id, err, URL)
        },
      })

      player.play()
    },
    before() {
      if(mplayer.isBucle) {
        player.buildSong(index)
        return
      }

      const currentIndex = mplayer.songs.findIndex((song: ISong) => song.selected)

      if(currentIndex > 0) player.buildSong(currentIndex - 1)
      else player.buildSong(0)
    },
    play() {
      player.updateRate()
      Howler._howls[0].play()
    },
    pause() {
      Howler._howls[0].pause()
      mplayer.playing = false
    },
    next() {
      // First priority: Loop active
      if(mplayer.isBucle) {
        player.buildSong(index)
        return
      }
      // Second priority: Queue 
      if(mplayer.queue.length > 0) {
        const i = mplayer.isShuffle ? Math.round(Math.random() * (mplayer.queue.length - 1)) : 0
        const queueSongId = mplayer.queue[i].id
        index = mplayer.songs.findIndex((song: ISong) => song.id === queueSongId) // Find index of next song
        player.buildSong(index)
        mplayer.removeFromQueue(mplayer.queue[i].id) // Remove song from the queue
        lastSongs.push(mplayer.currentSong) // refactor last songs
        return
      }
      // Third priority: Random active
      if(mplayer.isShuffle) {
        index = historicalRandom()
        player.buildSong(index)
        lastSongs.push(mplayer.currentSong)
        return
      }
      // Last priority: Find next song available
      const currentIndex = mplayer.songsFilter.findIndex((song: ISong) => song.selected)
      console.log(currentIndex, mplayer.songsFilter.length)
      if(currentIndex < mplayer.songsFilter.length - 1) {
        player.buildSong(currentIndex + 1)
        lastSongs.push(mplayer.currentSong)
      } else {
        player.buildSong(0)
        lastSongs.push(mplayer.currentSong)
      }
    },
    updateRate() {
      if(Howler._howls.length > 0 && Howler._howls[0].playing()) {
        const nightcoreRate = mplayer.settings.nightcore / 100 + 1
        const lowcoreRate = 1 - ( mplayer.settings.lowcore / 100)
        
        if(mplayer.isNightcore) Howler._howls[0].rate(nightcoreRate)
        if(mplayer.isLowcore) Howler._howls[0].rate(lowcoreRate)
        if(!mplayer.isNightcore && !mplayer.isLowcore) Howler._howls[0].rate(1)
      }
    }    
  }

  /* Private functions */
  const historicalRandom = (): number => {
    const index = Math.floor(Math.random() * (mplayer.songs.length - 1))
    return index
  }

  const letDieSong = () => {
    const sound = Howler._howls[0]
    const delay = mplayer.settings.mixMode * 1000

    if(sound) {
      Howler._howls = []
      sound.fade(1, 0, delay)
      setTimeout(() => sound.unload(), delay)
    }
  }

  setInterval(() => {
    if(Howler._howls[0]?.playing()) {
      const duration = Howler._howls[0].duration()
      const newEnding = duration - (duration * mplayer.settings.songEnds / 100)
      const margin = mplayer.isDJMode ? newEnding : mplayer.settings.mixMode
      
      const deadLine = duration - margin
      const currentSecond = Howler._howls[0].seek()
      
      if(currentSecond > deadLine) player.next()
    }
  }, 1000)

  const stepFunction = () => {
    const nextWidth = Howler._howls[0]?.seek() / Howler._howls[0]?.duration() * 100
    mplayer.dynamicWidth = nextWidth + '%'
    window.requestAnimationFrame(() => stepFunction())
  }

  window.requestAnimationFrame(() => stepFunction())

  return {
    player
  }
}

export default usePlayer
