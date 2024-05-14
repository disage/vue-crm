<template>
  <div class="board-container">
    <table class="board">
      <thead>
        <tr>
          <th v-for="(columnId, index) in columnOrder" :key="columnId" class="board-header-item" :style="{ width: `${getColumnById(columnId).width}px` }">
            <span class="board-header-title" @mousedown="onDrag(index)">{{ getColumnById(columnId).label }}</span>
            <span class="column-resizer" @mousedown="startResize(columnId)"></span>
          </th>
          <th>
            <div class="add-column-button">
              <v-menu v-model="isAddColumnMenuOpen" :close-on-content-click="false" location="end">
                <template v-slot:activator="{ props }">
                  <v-btn variant="text" icon="mdi mdi-plus" @click="resetInput" v-bind="props" />
                </template>

                <v-card min-width="300">
                  <v-list>
                    <v-list-item>
                      <v-text-field v-model="newColumnName" label="Field name" variant="solo-filled" />
                    </v-list-item>
                    <v-list-item>
                      <v-autocomplete v-model="newColumnType" label="Field type"
                        :items="['Text', 'Number', 'Date', 'Single Select', 'Multiple Select', 'Email', 'Phone']"
                        variant="solo-filled" />
                    </v-list-item>
                  </v-list>

                  <v-card-actions>
                    <v-btn variant="text" @click="isAddColumnMenuOpen = false"> Cancel </v-btn>
                    <v-btn color="primary" variant="text" @click="addColumn">Add</v-btn>
                  </v-card-actions>
                </v-card>
              </v-menu>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in data" :key="item.id">
          <td v-for="(columnId) in columnOrder" :key="columnId" @click="startEditing(item, columnId)" class="board-cell">
            <template v-if="!isEditing(item.id, columnId)">
              <!--use component registaion - <component :is="dynamicComponent"> -->
              <template v-if="getColumnById(columnId).type === 'singleselect'">
                <v-autocomplete v-model="item.columns[columnId]" variant="solo-filled"
                  :items="getColumnById(columnId).options" />
              </template>
              <p class="board-cell-text" v-else>{{ item.columns[columnId] }}</p>
            </template>
            <template v-else>
              <template v-if="getColumnById(columnId).type === 'text'">
                <v-text-field v-model="editedValue" variant="solo-filled" @blur="stopEditing(item.id, columnId)" />
              </template>
              <template v-else-if="getColumnById(columnId).type === 'number'">
                <v-text-field type="number" variant="solo-filled" v-model="editedValue"
                  @blur="stopEditing(item.id, columnId)" />
              </template>
              <template v-else-if="getColumnById(columnId).type === 'date'">
                <v-menu v-model="isCalendarOpen" :close-on-content-click="false" location="end"
                  @update:modelValue="stopEditing(item.id, columnId)">
                  <template v-slot:activator="{ props }">
                    <span v-bind="props">{{ item.columns[columnId] }}</span>
                  </template>
                  <v-date-picker v-model="formattedDate" />
                </v-menu>
              </template>
            </template>
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="isDragging" :style="{ left: mouseX + 'px', top: mouseY + 'px', width: columnWidth + 'px' }"
      class="custom-cursor"></div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue'

export default {
  name: 'BoardView',
  setup () {
    // Hooks
    onMounted(() => {
      window.addEventListener('mousemove', updateCursorPosition)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('mousemove', updateCursorPosition)
    })

    // Mock data
    const columns = ref([
      { id: 5, name: 'column1', label: 'ID', type: 'text', width: 100 },
      { id: 6, name: 'column2', label: 'Name', type: 'text', width: 200 },
      { id: 7, name: 'column3', label: 'Age', type: 'number', width: 300 },
      { id: 8, name: 'column4', label: 'Profession', type: 'singleselect', options: ['QA', 'PM', 'FE DEV', 'BE DEV', 'UI UX'], width: 400 }
    ])
    const data = ref([
      { id: 1, columns: { 5: 1, 6: 'Alex', 7: 21, 8: 'QA' } },
      { id: 2, columns: { 5: 2, 6: 'Dima', 7: 22, 8: 'PM' } },
      { id: 3, columns: { 5: 3, 6: 'Vlad', 7: 24, 8: 'QA' } }
    ])
    const columnOrder = ref(columns.value.map(column => column.id))

    // Custom cursor
    const mouseX = ref(0)
    const mouseY = ref(0)
    const updateCursorPosition = event => {
      mouseX.value = event.pageX
      mouseY.value = event.pageY
    }

    // Column drag&drop
    const columnWidth = ref(null)
    const dragPosition = reactive({ left: 0, top: 0 })
    const isDragging = ref(false)
    const selectedColumn = ref(null)
    const selectedIndex = ref(null)

    const onDrag = index => {
      dragPosition.left = event.clientX
      dragPosition.top = event.clientY
      selectedIndex.value = index
      selectedColumn.value = document.querySelectorAll('th')[index]
      columnWidth.value = selectedColumn.value.offsetWidth
      const columnRect = selectedColumn.value.getBoundingClientRect()
      mouseX.value = columnRect.left + columnRect.width / 2
      mouseY.value = columnRect.top + columnRect.height / 2
      isDragging.value = true
      selectedColumn.value.classList.add('dragging')
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    const onMouseMove = event => {
      if (isDragging.value) {
        dragPosition.left = event.clientX
        dragPosition.top = event.clientY
        const hoveredIndex = getHoveredIndex(selectedIndex.value)
        const columns = document.querySelectorAll('th')
        for (let i = 0; i < columns.length; i++) {
          if (i !== selectedIndex.value) {
            columns[i].classList.remove('hovered')
          }
        }
        if (hoveredIndex !== null && hoveredIndex !== selectedIndex.value) {
          columns[hoveredIndex].classList.add('hovered')
        }
      }
    }

    const onMouseUp = () => {
      isDragging.value = false
      if (selectedColumn.value) {
        selectedColumn.value.classList.remove('dragging')
      }
      const hoveredIndex = getHoveredIndex(selectedIndex.value)
      const columns = document.querySelectorAll('th')
      for (let i = 0; i < columns.length; i++) {
        if (i !== selectedIndex.value) {
          columns[i].classList.remove('hovered')
        }
      }
      if (hoveredIndex !== null && hoveredIndex !== selectedIndex.value) {
        columnOrder.value.splice(hoveredIndex, 0, columnOrder.value.splice(selectedIndex.value, 1)[0]) // mb refactor
        data.value.forEach(item => {
          const updatedColumns = {}
          columnOrder.value.forEach(columnName => {
            updatedColumns[columnName] = item.columns[columnName]
          })
          item.columns = updatedColumns
        })
      }
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    const getHoveredIndex = selectedIndex => {
      const columns = document.querySelectorAll('th')
      for (let i = 0; i < columns.length; i++) {
        if (i !== selectedIndex) {
          const bounds = columns[i].getBoundingClientRect()
          if (
            dragPosition.left > bounds.left &&
            dragPosition.left < bounds.right
          ) {
            return i
          }
        }
      }
      return null
    }

    // Cell editing
    const editing = ref({})
    const editedValue = ref('')

    const startEditing = (item, columnId) => {
      const type = columnType(columnId)
      if (type !== 'singleselect') {
        editing.value = {}
        editing.value[item.id + '_' + columnId] = true
        editedValue.value = item.columns[columnId]
      }
      if (type === 'date') isCalendarOpen.value = true
    }

    const stopEditing = (itemId, columnId) => {
      editing.value[itemId + '_' + columnId] = false
      data.value.find(item => item.id === itemId).columns[columnId] = editedValue.value
    }

    const isEditing = (itemId, columnId) => {
      return editing.value[itemId + '_' + columnId]
    }

    const columnType = (columnId) => {
      return columns.value.find(column => column.id === parseInt(columnId, 10)).type || 'text'
    }

    const resetInput = () => {
      newColumnName.value = ''
      newColumnType.value = ''
    }

    // Add new column
    const isAddColumnMenuOpen = ref(false)
    const newColumnName = ref('')
    const newColumnType = ref('')

    const addColumn = () => {
      const newColumnKey = Math.max(...columns.value.map(column => column.id)) + 1
      if (newColumnName.value.trim() !== '' && newColumnType.value.trim() !== '') {
        // here fix find all column ids and add id + 1
        columns.value.push({ id: newColumnKey, label: newColumnName.value, type: newColumnType.value.replace(/\s/g, '').toLowerCase(), width: 100 })
        data.value.forEach(item => {
          switch (newColumnType.value) {
            case 'text':
            case 'email':
            case 'singleselect':
              item.columns[newColumnKey] = ''
              break
            case 'number':
            case 'phone':
              item.columns[newColumnKey] = 0
              break
            default:
              item.columns[newColumnKey] = ''
          }
        })
        columnOrder.value.push(newColumnKey)
        isAddColumnMenuOpen.value = false
        newColumnName.value = ''
        newColumnType.value = ''
      }
    }

    // Calendar
    const isCalendarOpen = ref(false)

    const formattedDate = computed({
      get: () => new Date(editedValue.value),
      set: (value) => {
        editedValue.value = value.toLocaleDateString('en-CA').slice(0, 10)
      }
    })

    // Resize
    let resizingColumnIndex = null
    let startX = null

    const startResize = (index) => {
      resizingColumnIndex = index
      startX = event.pageX
      document.addEventListener('mousemove', resize)
      document.addEventListener('mouseup', stopResize)
    }

    const resize = (event) => {
      if (resizingColumnIndex !== null) {
        const delta = event.pageX - startX
        getColumnById(resizingColumnIndex).width += delta
        startX = event.pageX
      }
    }

    const stopResize = () => {
      resizingColumnIndex = null
      startX = null
      document.removeEventListener('mousemove', resize)
      document.removeEventListener('mouseup', stopResize)
    }

    // Other
    const getColumnById = (columnId) => {
      return columns.value.find(column => column.id === columnId)
    }

    return {
      addColumn,
      columnOrder,
      columns,
      columnWidth,
      data,
      dragPosition,
      editedValue,
      formattedDate,
      getColumnById,
      isAddColumnMenuOpen,
      isCalendarOpen,
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
      stopEditing
    }
  }
}
</script>

<style lang="scss" scoped>
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
  padding: 0 20px;
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
    min-width: 100px;
    border: 1px solid rgba(134, 134, 134, 0.2);
    position: relative;

    .column-resizer {
      cursor: col-resize;
      height: 100%;
      position: absolute;
      right: -8px;
      top: 0;
      z-index: 3;
      width: 16px;
    }
  }
  &-title {
    cursor: move;
  }
}

tr {
  border: 1px solid rgba(134, 134, 134, 0.2);

}

.hovered {
  position: relative;
  box-shadow: 1px 1px 9px 3px rgba(130, 130, 130, 0.2) inset;
}
</style>
