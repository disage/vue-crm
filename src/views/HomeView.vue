<template>
  <v-layout>
    <SidebarComponent />
    <v-main>
      <HomeBanner />
      <v-expansion-panels>
        <v-expansion-panel>
          <v-expansion-panel-title>Recently visited</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="mx-auto">
                  <v-img class="align-end text-white" height="200" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                    cover>
                  </v-img>

                  <v-card-title class="pt-4">{{ item.title }}</v-card-title>
                  <v-card-text>{{ item.description }}</v-card-text>
                  <v-card-actions class="d-flex justify-space-between">
                    <v-tooltip text="Private">
                      <template v-slot:activator="{ props }">
                        <v-icon icon="mdi-lock" v-bind="props"></v-icon>
                      </template>
                    </v-tooltip>
                    <v-btn prepend-icon="mdi-pin">Pin</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-main>
  </v-layout>
</template>

<script lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue'
import HomeBanner from '@/components/HomeBanner.vue'

export default {
  components: {
    SidebarComponent,
    HomeBanner
  },
  setup () {
    const items = [
      {
        id: 1,
        title: 'Contact',
        description: 'work managment > My workspace'
      },
      {
        id: 2,
        title: 'Interaction',
        description: 'work managment > My workspace'
      },
      {
        id: 3,
        title: 'Client',
        description: 'work managment > My workspace'

      },
      {
        id: 4,
        title: 'Product',
        description: 'work managment > My workspace'

      }
      // Додайте інші елементи за потребою
    ]
    return { items }
  }
}
</script>
