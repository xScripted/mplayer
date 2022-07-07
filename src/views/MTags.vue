<script lang="ts">
import { defineComponent } from 'vue'
import { useMPlayerStore } from '@/store'
import useTags from '../services/useTags'
import { IonButton, IonToggle, IonIcon } from '@ionic/vue'
import {
  expand,
  contract,
  add,
  pricetags,
  close,
  trash,
  brushOutline,
  brush,
  refresh,
} from 'ionicons/icons'

export default defineComponent({
  components: {
    IonButton,
    IonIcon,
    IonToggle,
  },
  setup() {
    const mplayer = useMPlayerStore()
    const {
      formData,
      gradient,
      createTag,
      isForm,
      startClick,
      endClick,
      updateTag,
      editTagId,
      clearForm,
      deleteTag,
    } = useTags()

    return {
      songs: mplayer.songs,
      formData,
      gradient,
      createTag,
      isForm,
      mplayer,
      startClick,
      endClick,
      updateTag,
      editTagId,
      clearForm,
      deleteTag,

      // icons
      contract,
      expand,
      add,
      pricetags,
      close,
      trash,
      brushOutline,
      brush,
      refresh,
    }
  },
})
</script>

<template>
  <div id="MTags">
    <div class="tags-tools">
      <div class="tag-mode">
        <ion-icon :icon="contract" />
        <ion-toggle
          :checked="mplayer.tagAndOr"
          value="false"
          @ionChange="
            () => {
              mplayer.tagAndOr = !mplayer.tagAndOr
              mplayer.filterSongs()
            }
          "
        />
        <ion-icon :icon="expand" />
      </div>
      <div class="group-right">
        <div
          v-if="!isForm"
          class="edit-song-tags"
          @click="
            () => {
              mplayer.modeBuilder = !mplayer.modeBuilder
              mplayer.filterSongs()
            }
          "
        >
          <ion-icon v-if="mplayer.modeBuilder" :icon="brush" />
          <ion-icon v-else :icon="brushOutline" />
        </div>

        <ion-icon
          v-if="!isForm"
          @click="mplayer.clearStatus()"
          style="font-size: 20px"
          :icon="refresh"
        />
        <div class="open-form">
          <div v-if="!isForm" class="open-btn" @click="isForm = true">
            <ion-icon :icon="add" />
            <ion-icon :icon="pricetags" />
          </div>
          <ion-icon
            v-else
            @click="
              () => {
                clearForm()
                isForm = false
              }
            "
            :icon="close"
          />
        </div>
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
        v-if="!editTagId"
        @click="createTag"
        style="grid-column: 1 / 3; height: 50px; margin-top: 50px"
      >
        Create
      </ion-button>
      <div v-else class="update-buttons">
        <ion-button @click="updateTag"> Update </ion-button>
        <ion-button @click="deleteTag" color="danger"> Delete </ion-button>
      </div>
    </div>
    <div class="tags-container" v-else>
      <div
        v-for="tag of mplayer.tags"
        class="tag"
        :class="tag.status"
        :style="{ background: tag.bgColor, color: tag.textColor }"
        :key="tag.id"
        @mousedown="startClick()"
        @mouseup="endClick(tag)"
      >
        {{ tag.name }}
      </div>
    </div>
    <div v-if="mplayer.tags.length === 0 && !isForm" class="tags-info">
      Tags are used to add attributes to your songs (e.g: Rock, EDM, Remix,
      Chill, Favourites...).<br /><br />
      This is useful to filter the playlist and make custom playlist combining
      the tags that you want to hear
      <br />
      <br />
      <ion-icon :icon="contract" /> Filter songs that have BOTH tags
      <br />
      <br />
      <ion-icon :icon="expand" /> Filter songs that have atleast one tag
      <br />
      <br />
      <ion-icon :icon="brushOutline" /> Activate mode editor, allows you to add
      or remove current tags selected to songs by clicking the song on the
      playlist tab. (1st click: add, 2nd click: remove)
      <br />
      <br />
      <ion-icon :icon="pricetags" /> Form to create a new tag
      <br />
      <br />
      <ion-icon :icon="trash" /> Unselect all the tags
      <br />
      <br />
      To edit an existing tag hold click one second and form will display
      <br />
      <br />
      There are three states for tags: normal, activated & negative
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

    .group-right {
      display: flex;
      align-items: center;
      justify-content: space-between;

      ion-icon {
        padding: 10px;
        padding-left: 20px;
        font-size: 20px;
      }
    }

    .open-form {
      margin-top: 5px;
      font-size: 20px;

      .open-btn {
        ion-icon:nth-child(1) {
          position: absolute;
          color: black;
          font-size: 14px;
          z-index: 2;
          margin-top: 2px;
          margin-left: 2px;
        }
      }
    }
  }

  .create-tag-form {
    display: grid;
    grid-gap: 10px;
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
        height: 40px;
      }
    }

    .update-buttons {
      grid-column: 1 / 3;
      display: flex;
      flex-direction: column;

      ion-button {
        height: 50px;
        margin-top: 20px;
      }
    }

    .preview {
      display: flex;
      justify-content: center;
      margin: 20px 0;

      .tag {
        width: 150px;
      }
    }
  }

  .tags-container {
    display: grid;
    margin-top: 20px;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 15px;
  }

  .tags-info {
    color: grey;
  }
}
</style>
