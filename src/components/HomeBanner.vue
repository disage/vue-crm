<template>
    <div>
        <v-banner lines="one" icon="mdi-account" color="deep-purple-accent-4">
            <div>
                <v-banner-text>
                    <h4>Good night, User!</h4>
                </v-banner-text>
                <v-banner-text>Quickly access your recent boards, Inbox and workspaces</v-banner-text>
            </div>
            <template v-slot:actions>
                <v-btn :icon="theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-moon-waning-crescent'"
                    @click="toggleTheme" />
                <v-btn icon="mdi-magnify" @click="toggleSearch" />
            </template>
        </v-banner>
        <template>
            <v-dialog class="search-modal" v-model="searchVisible" width="500px">
                <h3 class="search-modal-title">Quick Search !</h3>
                <v-card class="search-modal-card">
                    <v-autocomplete autofocus label="Search for boards, dashboards and workspaces"
                        :items="['Contact', 'Client', 'Product']" variant="solo-filled" />
                </v-card>
            </v-dialog>
        </template>
    </div>
</template>

<style lang="scss">
.v-overlay__scrim {
    opacity: 0.1 !important;
}

.search-modal {
    &-title {
        text-align: center;
    }

    &-card {
        padding: 5px !important;
    }
}
</style>

<script lang="ts">
import { ref } from 'vue'
import { useTheme } from 'vuetify'

export default {
  setup () {
    const searchVisible = ref(false)
    const searchText = ref('')
    const theme = useTheme()

    const toggleTheme = () => {
      theme.global.name.value = theme.global.current.value.dark ? 'lightTheme' : 'darkTheme'
      const currentTheme = localStorage.getItem('VuetifyTheme')
      localStorage.setItem('VuetifyTheme', currentTheme === 'lightTheme' ? 'darkTheme' : 'lightTheme')
    }

    const toggleSearch = () => {
      searchVisible.value = !searchVisible.value
    }

    const closeSearch = () => {
      searchVisible.value = false
    }

    return { theme, searchVisible, searchText, toggleSearch, closeSearch, toggleTheme }
  }
}
</script>
