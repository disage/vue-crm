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
    </v-list>
    <v-expansion-panels>
      <v-expansion-panel>
        <v-expansion-panel-title>
          <template v-slot:default="{ }">
            <v-list-item prepend-icon="mdi mdi-view-quilt" title="Boards" value="boards"></v-list-item>
          </template>
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-list density="compact" nav class="sidebar-links sidebar-sublinks">
            <router-link to="/boards/0001">
              <v-list-item prepend-icon="mdi mdi-view-quilt" title="Contact" value="contact"></v-list-item>
            </router-link>
            <router-link to="/boards/0002">
              <v-list-item prepend-icon="mdi mdi-view-quilt" title="Project" value="project"></v-list-item>
            </router-link>
            <router-link to="/boards/0003">
              <v-list-item prepend-icon="mdi mdi-view-quilt" title="Product" value="product"></v-list-item>
            </router-link>
          </v-list>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const drawer = ref(true)
const rail = ref(true)
</script>

<style lang="scss">
a {
  color: inherit;
  text-decoration: none;
}
.v-list {
  padding-bottom: 0!important;
}
.v-expansion-panel-title--active {
  .v-expansion-panel-title__overlay {
    background: none!important;
  }
}
.v-expansion-panel-text__wrapper {
  padding: 0!important;
}
.v-expansion-panel-title {
  padding: 0 !important;
  min-height: 10px!important;
  .v-list-item {
    padding-top: 0;
    padding-bottom: 0;

    .v-list-item-title {
      font-size: 0.8125rem;
    }

    .v-list-item__prepend {
      i {
        font-size: 24px;
      }
    }
  }
}

.v-expansion-panel__shadow {
  box-shadow: none !important;
}
.sidebar-sublinks {
  margin-left: 50px;
}
</style>
