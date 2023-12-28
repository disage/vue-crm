<template>
  <v-navigation-drawer v-model="drawer" :rail="rail" expand-on-hover permanent @click="rail = false">
    <v-list-item nav>
      <template v-slot:append>
        <v-btn variant="text" :icon="rail ? 'mdi-chevron-right' : 'mdi-chevron-left'" @click.stop="rail = !rail"></v-btn>
      </template>
    </v-list-item>

    <v-divider></v-divider>

    <v-list density="compact" nav class="sidebar-links">
      <router-link to="/">
        <v-list-item prepend-icon="mdi mdi-home" title="Home" value="home"></v-list-item>
      </router-link>
      <v-list-item prepend-icon="mdi-briefcase" title="Workspace" value="workspace"></v-list-item>
      <v-list-item prepend-icon="mdi-account" title="My Account" value="account"></v-list-item>
      <router-link to="/boards/0001">
        <v-list-item prepend-icon="mdi mdi-view-quilt" title="Contact" value="contact"></v-list-item>
      </router-link>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(true)
</script>

<style lang="scss">
.sidebar-links {
  a {
    color: inherit;
    text-decoration: none;
  }
}
</style>
