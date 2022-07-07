import { defineStore } from 'pinia'
import ISong from '@/models/ISong'
import ITag from '@/models/ITag'
import ISettings from '@/models/ISettings'
import Storage from '@/api/storage'

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
      dynamicWidth: '0%',
      modeBuilder: false,
      tagAndOr: false
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
        let tagExists = true;

        if(!this.modeBuilder) {
          const negative = this.tags.some((tag: ITag) => tag.status === 'unactive' && song.tags.includes(tag.id))
          if(negative) return false

          const activeTags = this.tags.filter((tag: ITag) => tag.status === 'active')
          if(this.tagAndOr) {
            tagExists = activeTags.some((tag: ITag) => song.tags.includes(tag.id))
          } else {
            tagExists = activeTags.every((tag: ITag) => song.tags.includes(tag.id))
          }
        }
          
        const inTitle = song.title.toLowerCase().includes(this.filterText)
        const inArtist = song.artist.toLowerCase().includes(this.filterText)

        return (inTitle || inArtist) && tagExists
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
    applyTagsToSong(id: string) {
      const i = this.songs.findIndex((song: ISong) => song.id === id)

      this.tags.map((tag: ITag) => {
        if(tag.status == 'active') {
          const exists = this.songs[i].tags.includes(tag.id)
          if(!exists) this.songs[i].tags.push(tag.id)
        }

        if(tag.status == 'unactive') {
          this.songs[i].tags = this.songs[i].tags.filter((idt: string) => idt != tag.id)
        }
      })

      Storage.setMetaSongs(this.songs)
    },
    addSongToQueue(song: ISong) {
      this.queue.push(song)
    },
    removeFromQueue(songId: string) {
      this.queue = this.queue.filter((song: ISong) => song.id !== songId)
    },
    toggleTagStatus(id: string) {
      const i = this.tags.findIndex((tag: ITag) => tag.id === id)
      const status = this.tags[i].status

      this.tags[i].status = status ? (status === 'active' ? 'unactive' : '') : 'active' 
      this.filterSongs()
    },
    clearStatus() {
      for(const i in this.tags) this.tags[i].status = ''
    }
  },
})
