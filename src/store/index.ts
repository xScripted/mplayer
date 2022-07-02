import { defineStore } from 'pinia'
import ISong from '@/models/ISong'
import ITag from '@/models/ITag'
import ISettings from '@/models/ISettings'

type Orders = 'title' | 'artist' | 'date'

export const useMPlayerStore = defineStore('MPlayer', {
  state: () => {
    return { 
      songs: [] as ISong[], 
      songsFilter: [] as ISong[], 
      tags: [] as ITag[], 
      queue: [] as ISong[],
      filterText: '',
      orderBy: {
        title: 'NONE',
        artist: 'NONE',
        date: 'NONE',
      },
      settings: {
        nightcore: 10,
        lowcore: 10,
        songStarts: 0, // %
        songEnds: 0, // %
        mixMode: 0, // seconds 
      } as ISettings,
      isNightcore: false,
      isLowcore: false,
      isDJMode: false,
      isBucle: false,
      isShuffle: false,
      playing: false,
      currentSong: {} as ISong,
      dynamicWidth: '0%'
    }
  },
  actions: {
    storeSongs(songs: ISong[]) {
      this.songs = this.songs.concat(songs)
      this.songsFilter = this.songs
    },
    storeTags(tags: ITag[]) {
      this.tags = this.tags.concat(tags)
    },
    filterSongs() {
      this.songsFilter = this.songs.filter((song: ISong) => {
        const inTitle = song.title.toLowerCase().includes(this.filterText)
        const inArtist = song.artist.toLowerCase().includes(this.filterText)
        return inTitle || inArtist
      })
    },
    orderByType(type: Orders) {
      if(this.orderBy[type] != 'NONE') {
        this.songsFilter.sort((a: ISong, b: ISong) => { //Refactor...
            const ar1 = typeof a[type] === 'string' ? a[type].toString().toLowerCase() : a[type]
            const ar2 = typeof b[type] === 'string' ? b[type].toString().toLowerCase() : b[type]
          
            const ti1 = a.title.toLowerCase()
            const ti2 = b.title.toLowerCase()
          
            if (ar1 < ar2) return this.orderBy[type] === 'ASC' ? -1 : 1
            if (ar1 > ar2) return this.orderBy[type] === 'ASC' ? 1 : -1

            // Always reorder by title
            if (ti1 < ti2) return -1
            if (ti2 > ti1) return 1
            return 0
        })
      }
    },
    addSongToQueue(song: ISong) {
      this.queue.push(song)
    },
    removeFromQueue(songId: string) {
      this.queue = this.queue.filter((song: ISong) => song.id !== songId)
    }
  },
})
