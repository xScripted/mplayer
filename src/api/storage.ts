import ISong from '@/models/ISong'
import ITag from '@/models/ITag'
import ISettings from '@/models/ISettings'

// Refactor needed 
export default {
  setSongs: async (songs: ISong[]): Promise<void> => {
    if(window.indexedDB) {
      const open = window.indexedDB.open('myplayer_db', 1)

      open.onupgradeneeded = () => {
        const db = open.result;
    
        db.createObjectStore('songs_file', { keyPath: 'id' })
      }

      open.onsuccess = () => {
        const db = open.result
        const LocalStorageMetaSongs: ISong[] = []
        const OSSongsFile = db.transaction('songs_file', 'readwrite').objectStore('songs_file')

        songs.map((song: ISong) => {
          OSSongsFile.add({
            id: song.id,
            path: song.path,
          })

          LocalStorageMetaSongs.push({
            id: song.id,
            title: song.title,
            artist: song.artist,
            selected: false,
            cover: '',
            tags: [],
            date: song.date
          })          
        })

        window.localStorage.setItem('mplayer_songs_meta', JSON.stringify(LocalStorageMetaSongs))
      }

      open.onerror = (error) => console.log('IDB err', error)
    } else {
      console.error('Indexed DB not available :(')
    }
  },
  getSongFile: async (songId: string): Promise<any> => {
    if(window.indexedDB) {
      const open = window.indexedDB.open('myplayer_db', 1)

      return new Promise(resolve => {
        open.onsuccess = async () => {          
          const db = open.result
          const OSSongsFile = db.transaction('songs_file').objectStore('songs_file')
          const query = await OSSongsFile.get(songId)
          
          query.onsuccess = () => resolve(query.result)
          query.onerror = (err) => console.error('GetSongFile - ', err) 
        }
      })
    }
  },
  setMetaSongs: (songs: ISong[]) => {
    window.localStorage.setItem('mplayer_songs_meta', JSON.stringify(songs))
  },
  getMetaSongs: (): ISong[] => {
    const songsMeta = window.localStorage.getItem('mplayer_songs_meta')
    return JSON.parse(songsMeta || '[]')
  },
  saveSettings: (settings: ISettings) => {
    window.localStorage.setItem('mplayer_settings', JSON.stringify(settings))
  },
  getSettings: (): ISettings => {
    const settings = window.localStorage.getItem('mplayer_settings')
    return settings ? JSON.parse(settings) : false
  },
  setTags: (tags: ITag[]) => {
    tags = tags.map((tag: ITag) => {
      tag.status = ''
      return tag
    })
    window.localStorage.setItem('mplayer_tags', JSON.stringify(tags))
  },
  getTags(): ITag[] {
    const tags = window.localStorage.getItem('mplayer_tags')
    return JSON.parse(tags || '[]')
  } 
}
