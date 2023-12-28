<template>
  <v-layout>
    <v-main>
      <HomeBanner />
      <SidebarComponent />
      <router-view />
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import HomeBanner from '@/components/HomeBanner.vue'
import SidebarComponent from '@/components/SidebarComponent.vue'
export default {
  components: {
    SidebarComponent,
    HomeBanner
  }
}
</script>
