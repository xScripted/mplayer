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
        db.createObjectStore('songs_meta', { keyPath: 'id' }) 
      }

      open.onsuccess = () => {
        const db = open.result

        const OSSongsFile = db.transaction('songs_file', 'readwrite').objectStore('songs_file')
        const OSSongsMeta = db.transaction('songs_meta', 'readwrite').objectStore('songs_meta')

        songs.map((song: ISong) => {
          OSSongsFile.add({
            id: song.id,
            path: song.path,
          })

          OSSongsMeta.add({
            id: song.id,
            title: song.title,
            artist: song.artist,
            selected: false,
            tags: [],
            date: song.date
          })
        })
      }

      open.onerror = (error) => console.log('IDB err', error)
    } else {
      console.error('Indexed DB not available :(')
    }
  },
  getSongFile:  async (songId: string): Promise<any> => {
    if(window.indexedDB) {
      const open = window.indexedDB.open('myplayer_db', 1)

      return new Promise(resolve => {
        open.onsuccess = async () => {
          
          const db = open.result
          const OSSongsMeta = db.transaction('songs_file').objectStore('songs_file')
          const query = await OSSongsMeta.get(songId)
          
          query.onsuccess = () => {
            console.log('query', query.result)
            resolve(query.result)
          }
          
          query.onerror = (err) => console.error('65 - ', err) 
        }
      })
    }
  },
  getSongs: async (): Promise<any> => {
    if(window.indexedDB) {
      const open = window.indexedDB.open('myplayer_db', 1)

      open.onupgradeneeded = () => {
        const db = open.result;
    
        db.createObjectStore('songs_file', { keyPath: 'id' })
        db.createObjectStore('songs_meta', { keyPath: 'id' }) 
        console.log('onupgradeneeded!')
      }

      return new Promise(resolve => {
        open.onsuccess = async () => {
          const db = open.result
          const OSSongsMeta = db.transaction('songs_meta').objectStore('songs_meta')
          const query = await OSSongsMeta.getAll()
          query.onsuccess = () => {
            resolve(query.result)
          }
          
          query.onerror = (err) => console.error('65 - ', err) 
        }
      })
    }

    return []
  },
  saveSettings: (settings: ISettings) => {
    window.localStorage.setItem('mplayer_settings', JSON.stringify(settings))
  },
  getSettings: (): ISettings => {
    const settings = window.localStorage.getItem('mplayer_settings')
    return settings ? JSON.parse(settings) : false
  },
  setTags: (tags: ITag[]) => {
    window.localStorage.setItem('mplayer_tags', JSON.stringify(tags))
  },
  getTags(): ITag[] {
    const tags = window.localStorage.getItem('mplayer_tags')
    return JSON.parse(tags || '[]')
  } 
}
