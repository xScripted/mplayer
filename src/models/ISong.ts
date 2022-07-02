import ITag from './ITag'

export default interface ISong {
  id: string,
  title: string,
  artist: string,
  path?: string,
  selected: boolean,
  cover: string,
  tags: ITag[],
  date: Date
}