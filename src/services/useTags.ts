import { reactive, computed, ref } from 'vue'
import { useMPlayerStore } from '@/store'
import ITag from '@/models/ITag'
import Storage from '@/api/storage'
import { v4 as uuid } from 'uuid'

const mplayer = useMPlayerStore()

const useTags = () => {
  const isForm = ref(false)
  const editTagId = ref('')
  let startTime: any = new Date()

  const formData = reactive({
    name: '',
    textColor: '#FFFFFF',
    grad1: '#dc01c2',
    grad2: '#530693'
  })
  
  const gradient = computed(() => {
    return `linear-gradient(214deg, ${formData.grad2} 0%, ${formData.grad1} 100%)`
  })

  const ungradient = (gradient: string) => {
    const grad1 = '#' + (gradient.split('#')[1].split(' ')[0])
    const grad2 = '#' + (gradient.split('#')[2].split(' ')[0])
    return { grad1, grad2 }
  }

  const createTag = () => {
    const tag = {
      id: 'tag-' + uuid(),
      name: formData.name,
      textColor: formData.textColor,
      bgColor: gradient.value,
      status: ''
    } as ITag

    mplayer.tags.push(tag)
    Storage.setTags(mplayer.tags)

    clearForm()
    isForm.value = false
  }

  const clearForm = () => {
    formData.name = ''
    formData.textColor = '#000000'
    formData.grad1 = '#444444'
    formData.grad2 = '#444444'
  }

  const startClick = () => (startTime = new Date())

  const endClick = (tag: ITag) => {
    const endTime: any = new Date()
    const timeDiff = endTime - startTime // ms

    if (mplayer.modeBuilder && timeDiff > 500) {
      isForm.value = true

      const { grad1, grad2 } = ungradient(tag.bgColor)

      formData.name = tag.name
      formData.textColor = tag.textColor
      formData.grad1 = grad1
      formData.grad2 = grad2

      editTagId.value = tag.id
    } else {
      mplayer.toggleTagStatus(tag.id)
    }
  }

  const updateTag = () => {
    const i = mplayer.tags.findIndex((tag: ITag) => tag.id === editTagId.value)
    mplayer.tags[i].name = formData.name
    mplayer.tags[i].bgColor = gradient.value 
    mplayer.tags[i].textColor = formData.textColor

    Storage.setTags(mplayer.tags)

    //resets
    editTagId.value = ''
    isForm.value = false
    clearForm()
  }

  const deleteTag = () => {
    mplayer.tags = mplayer.tags.filter((tag: ITag) => tag.id !== editTagId.value)
    Storage.setTags(mplayer.tags)
    clearForm()
    isForm.value = false
  }

  return {
    formData,
    gradient,
    createTag,
    isForm,
    startClick,
    endClick,
    updateTag,
    editTagId,
    clearForm,
    deleteTag
  }
}

export default useTags