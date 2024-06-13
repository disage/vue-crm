<template>
  <div class="board-container">
    <v-data-table :headers="sortedColumns" :items="data" class="elevation-1" :key="tableKey">
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>CLIENTS BOARD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn class="mb-2" color="primary" dark v-bind="props">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">Add item</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col>
                      <v-text-field v-model="newColumnName" label="Field name" variant="solo-filled" />
                    </v-col>
                    <v-col>
                      <v-autocomplete v-model="newColumnType" label="Field type"
                        :items="['Text', 'Number', 'Date', 'Single Select', 'Multiple Select', 'Email', 'Phone']"
                        variant="solo-filled" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="close">
                  Cancel
                </v-btn>
                <v-btn color="blue darken-1" text @click="save">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
              <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>

      <!-- eslint-disable-next-line vue/valid-v-slot-->
      <template v-slot:item.actions="{ item }">
        <v-icon small class="mr-2" @click="editItem(item)">
          mdi-pencil
        </v-icon>
        <v-icon small @click="deleteItem(item)">
          mdi-delete
        </v-icon>
      </template>

      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize">
          Reset
        </v-btn>
      </template>
      <!--Board Headers-->
      <!-- eslint-disable-next-line vue/no-unused-vars-->
      <template v-for="(header, index) in columns" :key="header.key" v-slot:[`header.${header.key}`]="header">
        <div class="board-header-item">
          <BoardAddColumnMenu v-if="header.column.type === 'addcolumn'" class="column-title" :boardColumns="columns" :boardData="data" @mousedown="onDrag(index)" />
          <span v-else class="column-title" @mousedown="onDrag(index)">
            {{ header.column.title }}
          </span>
          <div class="column-resizer-wrapper" @mousedown="startResize(header.column.key)">
            <div class="column-resizer"></div>
          </div>
        </div>
      </template>
      <!--Board Content-->
      <template v-for="column in columns" :key="column.key" v-slot:[`item.${column.key}`]="{ item }">
        <template v-if="column.type === 'text'">
          <v-text-field v-model="item[column.key]" outlined dense></v-text-field>
        </template>
        <template v-else-if="column.type === 'number'">
          <v-text-field v-model="item[column.key]" type="number" outlined dense></v-text-field>
        </template>
        <template v-else-if="column.type === 'singleselect'">
          <v-select v-model="item[column.key]" :items="['QA', 'PM', 'FE DEV', 'BE DEV', 'UI UX']" outlined
            dense></v-select>
        </template>
      </template>
    </v-data-table>
    <div v-if="isDragging" :style="{ left: mouseX + 'px', top: mouseY + 'px', width: columnWidth + 'px' }"
      class="custom-cursor"></div>
  </div>
</template>

<script>
import { defineComponent, ref, nextTick, watch, computed } from 'vue'
import BoardAddColumnMenu from './BoardAddColumnMenu.vue'
import useBoardView from './useBoardView.js'

export default defineComponent({
  name: 'BoardView',
  components: {
    BoardAddColumnMenu
  },

  setup () {
    const dialog = ref(false)
    const dialogDelete = ref(false)
    const fullData = ref([
      {
        id: 'primary',
        width: 200
      }
    ])
    const data = ref([
      {
        col_1: 'id1',
        col_2: 'Dima',
        col_3: 26,
        col_4: 'IT DEV'
      },
      {
        col_1: 'id3',
        col_2: 'Alex',
        col_3: 36,
        col_4: 'UX'
      }
    ])

    const columns = ref([
      { key: 'col_0', title: 'Add', type: 'addcolumn', width: 20 },
      { key: 'col_1', title: 'ID', type: 'text', width: 100 },
      { key: 'col_2', title: 'Name', type: 'text', width: 200 },
      { key: 'col_3', title: 'Age', type: 'number', width: 300 },
      { key: 'col_4', title: 'Profession', type: 'singleselect', width: 400 }
    ])
    const sortedColumns = computed(() => {
      return columns.value.filter(col => col.type !== 'addcolumn').concat(columns.value.find(col => col.type === 'addcolumn'))
    })

    const editedItem = ref({})
    const editedIndex = ref(-1)
    function editItem (item) {
      editedIndex.value = data.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      // dialog.value = true //check
    }
    function deleteItem (item) {
      editedIndex.value = data.value.indexOf(item)
      editedItem.value = Object.assign({}, item)
      dialogDelete.value = true
    }
    function deleteItemConfirm () {
      data.value.splice(editedIndex.value, 1)
      closeDelete()
    }
    function close () {
      dialog.value = false
      nextTick(() => {
        editedItem.value = Object.assign({}, {})
        editedIndex.value = -1
      })
    }
    function closeDelete () {
      dialogDelete.value = false
      nextTick(() => {
        editedItem.value = Object.assign({}, {})
        editedIndex.value = -1
      })
    }
    function save () {
      if (editedIndex.value > -1) {
        Object.assign(data.value[editedIndex.value], editedItem.value)
      } else {
        data.value.push(editedItem.value)
      }
      close()
    }
    watch(dialog, val => {
      val || close()
    })
    watch(dialogDelete, val => {
      val || closeDelete()
    })
    const {
      addColumn,
      columnWidth,
      editedValue,
      formattedDate,
      getColumnById,
      isAddColumnMenuOpen,
      isCalendarOpen,
      isColumnSettingsMenuOpen,
      isDragging,
      isEditing,
      mouseX,
      mouseY,
      newColumnName,
      newColumnType,
      onDrag,
      resetInput,
      startEditing,
      startResize,
      stopEditing,
      updateColumnSettingsMenuStatus
    } = useBoardView(columns, data, fullData)
    return {
      save,
      deleteItemConfirm,
      editItem,
      deleteItem,
      dialog,
      dialogDelete,
      addColumn,
      columns,
      columnWidth,
      data,
      editedValue,
      formattedDate,
      getColumnById,
      isAddColumnMenuOpen,
      isCalendarOpen,
      isColumnSettingsMenuOpen,
      isDragging,
      isEditing,
      mouseX,
      mouseY,
      newColumnName,
      newColumnType,
      onDrag,
      resetInput,
      startEditing,
      startResize,
      stopEditing,
      updateColumnSettingsMenuStatus,
      sortedColumns
    }
  }
})
</script>

<style lang="scss" scoped>
::v-deep .v-table>.v-table__wrapper>table {
  width: max-content !important;
}

.v-table {
  width: max-content;
  min-width: 100% !important;
}

table {
  border-collapse: collapse;
}

.board-container {
  padding: 50px;
  overflow-x: auto;

  .board {
    width: max-content;
  }
}

td {
  border: 1px solid rgba(134, 134, 134, 0.2);
  padding: 0 10px;
}

.column-settings-list {
  width: 100%;
}

.custom-cursor {
  position: fixed;
  top: 70px !important;
  height: 100vh;
  transform: translateX(-50%);
  background-color: #ccc;
  opacity: 0.2;
  pointer-events: none;
  z-index: 200;
}

.drag-indicator {
  position: fixed;
  width: 2px;
  background-color: gray;
  opacity: 0.5;
  pointer-events: none;
}

.dragging {
  background-color: rgba(204, 204, 204, 0.2)
}

.board-header {
  &-item {
    user-select: none;
    position: relative;

    .column-resizer-wrapper {
      cursor: col-resize;
      height: 100%;
      position: absolute;
      right: -23px;
      top: 0;
      transition-delay: 0.3s;
      transition: 0.2s;
      width: 14px;
      z-index: 3;
      display: flex;
      justify-content: center;

      &:hover .column-resizer {
        background-color: #6200EA;
        box-shadow: 0px 0px 3px 1.5px #6200EA;
        transition: 0.2s;
        width: 1px;
      }
    }

    .column-resizer {
      //cursor: col-resize;
      height: 100%;
      transition-delay: 0.3s;
      transition: 0.2s;
      width: 2px;
      z-index: 3;
      background-color: rgba(var(--v-theme-on-surface), 0.2);

      //change to js func (mouse down + move)

    }
  }

  &-title {
    cursor: pointer;
    height: 49px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

tr {
  border: 1px solid rgba(134, 134, 134, 0.2);

}

.hovered {
  position: relative;
  box-shadow: 1px 1px 9px 3px rgba(130, 130, 130, 0.2) inset;
}

.column-title {
  white-space: nowrap;
}
</style>
