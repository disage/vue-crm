import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

const selectedTheme = localStorage.getItem('VuetifyTheme') || 'darkTheme'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  theme: {
    defaultTheme: selectedTheme,
    themes: {
      lightTheme: {
        dark: false,
        colors: {
          primary: '#1976D2',
          'page-header-background': '#d7d7ce',
          'page-background': '#cdcdc1',
          'table-header': '#cdcdc1',
          background: '#c0c0b5',
          'header-background': '#b5b5a6',
          'info-text': '#666660'
        }
      },
      darkTheme: {
        dark: true,
        colors: {
          primary: '#1976D2',
          'page-header-background': '#282831',
          'page-background': '#32323E',
          'table-header': '#2e2e2e',
          background: '#3F3F4A',
          'header-background': '#4a4a59',
          'info-text': '#99999F'
        }
      }
    }
  }
})

createApp(App).use(store).use(router).use(vuetify).mount('#app')
