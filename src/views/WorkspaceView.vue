<template>
  <div class="workspace">
    <v-card>
      <v-card-title class="bg-deep-purple-accent-4">
        <span class="text-h5 workspace-name">Workspace Name</span>
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn variant="text" icon="mdi-dots-vertical" v-bind="props"></v-btn>
          </template>

          <v-list>
            <v-list-item>
              <v-btn variant="plain">Rename</v-btn>
            </v-list-item>
            <v-list-item>
              <v-btn variant="plain">Delete</v-btn>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-card-title>
      <v-card-text>
        <v-tabs v-model="currentItem">
          <v-tab v-for="item in tabs" :key="item" :value="'tab-' + item">
            {{ item }}
          </v-tab>
        </v-tabs>
        <v-window v-model="currentItem">
          <v-window-item v-for="tab in tabs" :key="tab" :value="'tab-' + tab">
            <v-card>
              <v-card-text>
                <div v-if="tab == 'Recent'">
                  <span class="workspace-tab-description">Boards and dashboards you visited recently in this workspace</span>
                  <v-card max-width="600">
                    <v-list>
                      <v-list-item v-for="board in recentBoards" :key="board.id" link>
                        <router-link class="list-link" :to="'/boards/' + board.id">
                          <v-icon icon="mdi-view-quilt" />
                          {{ board.title }}
                        </router-link>
                        <v-btn variant="text" :class="fav?.includes(board.id) ? 'text-red' : ''" icon="mdi-heart"
                          @click="toggleFavorite(board.id)" />
                      </v-list-item>
                    </v-list>
                  </v-card>
                </div>
                <div v-else>
                  <span class="workspace-tab-description">Members / 2</span>
                  <v-card max-width="600">
                    <v-list-item v-for="member in members" :key="member.id" link>
                      <div class="list-link">
                        <v-icon icon="mdi-account" />
                        {{ member.title }}
                      </div>
                      <v-menu>
                        <template v-slot:activator="{ props }">
                          <v-btn variant="plain" icon="mdi-dots-vertical" v-bind="props"/>
                        </template>
                        <v-list>
                          <v-list-item>
                            <v-btn variant="plain">Delete</v-btn>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-list-item>
                  </v-card>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue'
export default {

  setup () {
    const recentBoards = [
      {
        title: 'Board #1',
        id: 1,
        props: {
          prependIcon: 'mdi-view-quilt'
        }
      },
      {
        title: 'Board #2',
        id: 2,
        props: {
          prependIcon: 'mdi-view-quilt'
        }
      },
      {
        title: 'Board #3',
        id: 3,
        props: {
          prependIcon: 'mdi-view-quilt'
        }
      }
    ]
    const members = [
      {
        title: 'Alex Smith',
        id: 1,
        props: {
          prependIcon: 'mdi-view-quilt'
        }
      },
      {
        title: 'John Snow',
        id: 2,
        props: {
          prependIcon: 'mdi-view-quilt'
        }
      }
    ]
    const fav = ref<number[]>([])

    const toggleFavorite = (id: number) => {
      const index = fav.value.indexOf(id)
      if (index !== -1) {
        fav.value.splice(index, 1)
      } else {
        fav.value.push(id)
      }
    }
    const currentItem = ref('tab-Recent')
    const tabs = ref([
      'Recent',
      'Members'
    ])
    return { currentItem, tabs, fav, recentBoards, members, toggleFavorite }
  }

}

</script>

<style lang="scss">
.workspace {
  padding: 20px;

  &-name {
    margin-right: 20px;
  }

  &-tab-description {
    display: flex;
    margin-bottom: 20px;
  }
  .list-link {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    i {
      margin-right: 16px;
    }
  }
  .v-card-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .v-list-item__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
