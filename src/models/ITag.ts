export default interface ITag {
  id: string,
  name: string,
  textColor: string,
  bgColor: string,
  status: string
}

// Find a better way someday
export const isTag = (obj: ITag) => {
  const checks = [
    typeof obj.id === 'string',
    typeof obj.name === 'string',
    typeof obj.textColor === 'string',
    typeof obj.bgColor === 'string',
    typeof obj.status === 'string',
  ]

  return checks.every(el => el)
}