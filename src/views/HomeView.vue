<template>
  <div class="home-view">
    <h2>Recently visited</h2>
    <v-row>
      <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
        <router-link :to="`/boards/${item.id}`">
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
        </router-link>
      </v-col>
    </v-row>
    <h2>My workspaces</h2>
    <v-row>
      <v-col v-for="item in items" :key="item.id" cols="12" sm="6" md="4" lg="3">
        <router-link to="/workspace/1">
        <v-card class="mx-auto workspace-card" link>
          <img class="align-end text-white" height="60" src="https://cdn.vuetifyjs.com/images/cards/docks.jpg" cover />
          <span>Workspace 1</span>
        </v-card>
      </router-link>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
export default {
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
    ]
    return { items }
  }
}
</script>

<style>
.home-view {
  padding: 0px 20px 20px 20px;
  h2 {
    margin: 20px 0;
  }
}
.workspace-card {
  display: flex!important;
  align-items: center;
  span {
    margin-left: 20px;
  }
}
</style>
