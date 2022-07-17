import ISong from '@/models/ISong'
import ITag from '@/models/ITag'
import ISettings from '@/models/ISettings'

export default {
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
