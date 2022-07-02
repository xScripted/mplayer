<script lang="ts">
import { defineComponent } from 'vue'
import { useMPlayerStore } from '@/store'
import useTags from '../services/useTags'
import { IonButton, IonToggle, IonIcon } from '@ionic/vue'
import { expand, contract, add, pricetags, close } from 'ionicons/icons'

export default defineComponent({
  components: {
    IonButton,
    IonIcon,
    IonToggle,
  },
  setup() {
    const mplayer = useMPlayerStore()
    const { formData, gradient, btnForm, createTag, isForm } = useTags()

    return {
      songs: mplayer.songs,
      formData,
      gradient,
      btnForm,
      createTag,
      isForm,
      mplayer,

      // icons
      contract,
      expand,
      add,
      pricetags,
      close,
    }
  },
})
</script>

<template>
  <div id="MTags">
    <div class="tags-tools">
      <div class="tag-mode">
        <ion-icon :icon="contract" />
        <ion-toggle />
        <ion-icon :icon="expand" />
      </div>
      <div class="open-form">
        <div v-if="!isForm" class="open-btn" @click="isForm = true">
          <ion-icon :icon="pricetags" />
          <ion-icon :icon="add" />
        </div>
        <ion-icon v-else @click="isForm = false" :icon="close" />
      </div>
    </div>
    <div v-if="isForm" class="create-tag-form">
      <div class="preview" style="grid-column: 1 / 3">
        <div
          class="tag"
          :style="{ background: gradient, color: formData.textColor }"
        >
          {{ formData.name }}
        </div>
      </div>
      <div class="input-group">
        <label for="tag-name"> Name </label>
        <input id="tag-name" v-model="formData.name" type="text" />
      </div>
      <div class="input-group">
        <label for="tag-text-color"> Text Color </label>
        <input id="tag-text-color" v-model="formData.textColor" type="color" />
      </div>
      <div class="input-group">
        <label for="tag-grad1"> Gradient 1 </label>
        <input id="tag-grad1" v-model="formData.grad1" type="color" />
      </div>
      <div class="input-group">
        <label for="tag-grad2"> Gradient 2 </label>
        <input id="tag-grad2" v-model="formData.grad2" type="color" />
      </div>
      <ion-button
        @click="createTag"
        style="grid-column: 1 / 3; height: 50px; margin-top: 50px"
      >
        {{ btnForm }}
      </ion-button>
    </div>
    <div class="tags-container" v-else>
      <div
        class="tag"
        :style="{ background: tag.bgColor, color: tag.textColor }"
        v-for="tag of mplayer.tags"
        :key="tag.id"
      >
        {{ tag.name }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
#MTags {
  padding: 20px;
  background-color: rgb(26, 26, 26);
  color: white;
  height: 100%;

  .tags-tools {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .tag-mode {
      display: flex;
      align-items: center;
    }

    .open-form {
      font-size: 20px;

      ion-icon {
        padding: 5px;
      }
    }
  }

  .create-tag-form {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: 1fr 1fr;

    .input-group {
      display: flex;
      flex-direction: column;

      label {
        padding: 10px 0;
        text-align: center;
      }

      input {
        border-radius: 5px;
        width: 100%;
        color: black;
      }

      input[type='text'] {
        padding: 10px;
      }

      input[type='color'] {
        width: 100%;
        height: 50px;
      }
    }
  }

  .preview {
    display: flex;
    justify-content: center;
    margin: 30px 0;

    .tag {
      width: 150px;
    }
  }

  .tags-container {
    display: grid;
    margin-top: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 15px;
  }
  .tag {
    border-radius: 6px;
    width: 100%;
    min-height: 40px;
    padding: 5px;
    font-size: 15px;
    box-shadow: 0 0 5px 0 black;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &.active {
      border: 2px solid black;
      transform: skewY(-6deg) scale(0.9);
    }
    &.unactive {
      opacity: 0.5;
      transform: scale(0.7);
    }
  }
}
</style>
