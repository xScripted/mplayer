import { reactive, computed, ref } from 'vue'
import { useMPlayerStore } from '@/store'
import ITag from '@/models/ITag'
import Storage from '@/api/storage'
import { v4 as uuid } from 'uuid'

const mplayer = useMPlayerStore()

const useTags = () => {

  const isForm = ref(false)
  const btnForm = 'Crear'
  const formData = reactive({
    name: '',
    textColor: '#000000',
    grad1: '#444444',
    grad2: '#444444'
  })
  
  const gradient = computed(() => {
    return `linear-gradient(214deg, ${formData.grad1} 0%, ${formData.grad2} 100%)`
  })

  const createTag = () => {
    const tag = {
      id: 'tag-' + uuid(),
      name: formData.name,
      textColor: formData.textColor,
      bgColor: gradient.value
    } as ITag

    mplayer.tags.push(tag)
    Storage.setTags(mplayer.tags)

    formData.name = ''
    formData.textColor = '#000000'
    formData.grad1 = '#444444'
    formData.grad2 = '#444444'
  }

  return {
    formData,
    gradient,
    btnForm,
    createTag,
    isForm
  }
}

export default useTags