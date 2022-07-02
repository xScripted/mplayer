import { Howler, Howl } from 'howler'
import Storage from '@/api/storage'
import ISong from '@/models/ISong'
import { useMPlayerStore } from '@/store'

const useMusic = () => {
  const mplayer = useMPlayerStore()
  const lastSongs: ISong[] = []
  let index = 0
  let _pool = []

  const player = {
    async buildSong(i: number, mixMode = false) {
      index = i
      // Clear old songs
      Howler._howls.map((howl: any, index: number) => index > 1 ? howl.unload() : null)
      if(!mixMode && Howler._howls.length > 0) Howler._howls[0].fade(1, 0, mplayer.settings.mixMode * 1000)
     
      // Reset selected song
      mplayer.songs.map((song: ISong) => song.selected = false)

      // Set currentSong data
      mplayer.currentSong = mplayer.songs[i]
      const songId = mplayer.songs[i].id
      const URL = (await Storage.getSongFile(songId)).path

      Howler._howls[0] = new Howl({
        src: [URL],
        rate: 1,
        volume: 1,
        html5: false,
        onplay() {
          Howler._howls[0].fade(0, 1, mplayer.settings.mixMode * 1000)

          if(mplayer.isDJMode) {
            const newBeginning = mplayer.settings.songStarts * Howler._howls[0].duration() / 100
            Howler._howls[0].seek(newBeginning)
          }

          player.updateRate()

          const stepFunction = () => {
            // Refactor error
            const nextWidth = Howler._howls[0].seek() / Howler._howls[0].duration() * 100

            mplayer.dynamicWidth = nextWidth + '%'
            if(mplayer.playing) window.requestAnimationFrame(() => stepFunction())
          }

          window.requestAnimationFrame( () => stepFunction());
          console.log("Playing!");
        },
        onload() {
          console.log("Loaded!");
        },
        onend() {
          //player.next()
        },  
        onloaderror(id: any, err: any) {
          console.error('Load Error', id, err, URL);
        },
        onplayerror(id: any, err: any) {
          console.error('Play Error', id, err, URL);
        },
      });

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
      mplayer.playing = true
      mplayer.songs[index].selected = true
    },
    pause() {
      Howler._howls[0].pause()
      mplayer.playing = false
    },
    next(mixMode = false) {
      if(mplayer.isBucle) {
        player.buildSong(index, mixMode)
        return
      }

      if(mplayer.queue.length > 0) {
        const i = mplayer.isShuffle ? Math.round(Math.random() * (mplayer.queue.length - 1)) : 0
        const queueSongId = mplayer.queue[i].id
        index = mplayer.songs.findIndex((song: ISong) => song.id === queueSongId) // Find index of next song
        player.buildSong(index, mixMode)
        mplayer.removeFromQueue(mplayer.queue[i].id) // Remove song from the queue
        lastSongs.push(mplayer.currentSong) // refactor last songs
        return
      }
      //Posible refactor
      if(mplayer.isShuffle) {
        index = historicalRandom()
        player.buildSong(index, mixMode)
        lastSongs.push(mplayer.currentSong)
        return
      }

      const currentIndex = mplayer.songs.findIndex((song: ISong) => song.selected)
      if(currentIndex < mplayer.songs.length - 1) {
        player.buildSong(currentIndex + 1, mixMode)
        lastSongs.push(mplayer.currentSong)
      } else {
        player.buildSong(0, mixMode)
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

  setInterval(() => {
    if(Howler._howls.length > 0 && Howler._howls[0].playing()) {
      const duration = Howler._howls[0].duration()
      const newEnding = duration - (duration * mplayer.settings.songEnds / 100)
      const margin = mplayer.isDJMode ? newEnding : mplayer.settings.mixMode
      
      const deadLine = duration - margin
      const currentSecond = Howler._howls[0].seek()
      
      if(currentSecond > deadLine) player.next(true)
    }
  }, 1000)

  return {
    player
  }
}

export default useMusic
