<script lang="ts">
import { IonIcon } from '@ionic/vue'
import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

import {
  pricetagsOutline,
  pricetags,
  settings,
  settingsOutline,
  list,
  listOutline,
  musicalNotesOutline,
  musicalNotes,
} from 'ionicons/icons'

export default defineComponent({
  components: {
    IonIcon,
  },

  setup() {
    const route = useRoute()

    type TRoutes = 'Tags' | 'Playlist' | 'Queue' | 'Settings'

    const icons = {
      Tags: {
        active: pricetags,
        inactive: pricetagsOutline,
      },
      Playlist: {
        active: musicalNotes,
        inactive: musicalNotesOutline,
      },
      Queue: {
        active: list,
        inactive: listOutline,
      },
      Settings: {
        active: settings,
        inactive: settingsOutline,
      },
    }

    const activeIcon = (name: TRoutes) => {
      return route.name === name ? icons[name].active : icons[name].inactive
    }

    return {
      pricetags,
      pricetagsOutline,
      settings,
      settingsOutline,
      listOutline,
      list,
      musicalNotesOutline,
      musicalNotes,
      activeIcon,
    }
  },
})
</script>

<template>
  <div id="Tabs">
    <router-link :to="{ name: 'Tags' }">
      <ion-icon :icon="activeIcon('Tags')" />
      <h4>Tags</h4>
    </router-link>
    <router-link :to="{ name: 'Playlist' }">
      <ion-icon :icon="activeIcon('Playlist')" />
      <h4>Playlist</h4>
    </router-link>
    <router-link :to="{ name: 'Queue' }">
      <ion-icon :icon="activeIcon('Queue')" />
      <h4>Queue</h4>
    </router-link>
    <router-link :to="{ name: 'Settings' }">
      <ion-icon :icon="activeIcon('Settings')" />
      <h4>Settings</h4>
    </router-link>
  </div>
</template>

<style scoped lang="scss">
#Tabs {
  position: absolute;
  height: 60px;
  width: 100%;
  bottom: 0;
  background: rgb(0, 0, 0);
  z-index: 7;
  display: flex;
  justify-content: space-evenly;
  align-items: center;

  a {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    opacity: 0.5;
    width: 100%;

    &.router-link-active {
      opacity: 1;
    }
  }

  h4 {
    font-size: 12px;
    margin: 0;
  }

  ion-icon {
    font-size: 20px;
    padding: 7px;
  }
}
</style>
