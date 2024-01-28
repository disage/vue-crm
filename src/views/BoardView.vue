<template>
  <div class="board-view">
    <table>
      <thead>
        <tr>
          <th v-for="(columnId, index) in columnOrder" :key="columnId" @dragstart="onDragStart($event, index)"
            @dragover.prevent="onDragOver" @drop="onDrop($event, index)" draggable="true">
            {{ columns[columnId - 1].label }}
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
          <td v-for="(columnId) in columnOrder" :key="columnId" @dblclick="startEditing(item, columnId)">
            <template v-if="!isEditing(item.id, columnId)">
              <template v-if="columns[columnId - 1].type === 'singleselect'">
                <v-autocomplete v-model="item.columns[columnId]" variant="solo-filled"
                  :items="columns[columnId - 1].options" />
              </template>
              <div v-else>{{ item.columns[columnId] }}</div>
            </template>
            <template v-else>
              <template v-if="columns[columnId - 1].type === 'text'">
                <v-text-field v-model="editedValue" variant="solo-filled" @blur="stopEditing(item.id, columnId)" />
              </template>
              <template v-else-if="columns[columnId - 1].type === 'number'">
                <v-text-field type="number" variant="solo-filled" v-model="editedValue"
                  @blur="stopEditing(item.id, columnId)" />
              </template>
              <template v-else-if="columns[columnId - 1].type === 'date'">
                <v-menu v-model="isCalendarOpen" :close-on-content-click="false" location="end" @update:modelValue="stopEditing(item.id, columnId)">
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
  </div>
</template>

<script>
import { computed, ref } from 'vue'

export default {
  setup () {
    const isCalendarOpen = ref(false)
    const isAddColumnMenuOpen = ref(false)
    const newColumnName = ref('')
    const newColumnType = ref('')
    const editing = ref({})
    const editedValue = ref('')
    const columns = ref([
      { id: 1, name: 'column1', label: 'ID', type: 'text' },
      { id: 2, name: 'column2', label: 'Name', type: 'text' },
      { id: 3, name: 'column3', label: 'Age', type: 'number' },
      { id: 4, name: 'column4', label: 'Profession', type: 'singleselect', options: ['QA', 'PM', 'FE DEV', 'BE DEV', 'UI UX'] }
    ])
    const data = ref([
      { id: 1, columns: { 1: 1, 2: 'Alex', 3: 21, 4: 'QA' } },
      { id: 2, columns: { 1: 2, 2: 'Dima', 3: 22, 4: 'PM' } },
      { id: 3, columns: { 1: 3, 2: 'Vlad', 3: 24, 4: 'QA' } }
    ])
    const columnOrder = ref(columns.value.map(column => column.id))
    const onDragStart = (e, columnIndex) => {
      e.dataTransfer.setData('text/plain', columnIndex.toString())
    }

    const onDragOver = (e) => {
      e.preventDefault()
    }

    const resetInput = () => {
      newColumnName.value = ''
      newColumnType.value = ''
    }

    const addColumn = () => {
      const newColumnKey = columns.value.length + 1
      if (newColumnName.value.trim() !== '' && newColumnType.value.trim() !== '') {
        columns.value.push({ id: columns.value.length + 1, label: newColumnName.value, type: newColumnType.value.replace(/\s/g, '').toLowerCase() })

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
    const onDrop = (e, targetColumnIndex) => {
      const draggedColumnIndex = parseInt(e.dataTransfer.getData('text/plain'))

      if (targetColumnIndex !== draggedColumnIndex) {
        columnOrder.value.splice(targetColumnIndex, 0, columnOrder.value.splice(draggedColumnIndex, 1)[0])

        data.value.forEach(item => {
          const updatedColumns = {}
          columnOrder.value.forEach(columnName => {
            updatedColumns[columnName] = item.columns[columnName]
          })
          item.columns = updatedColumns
        })
      }
    }

    const startEditing = (item, columnId) => {
      editing.value = {}
      editing.value[item.id + '_' + columnId] = true
      editedValue.value = item.columns[columnId]
      const type = columnType(columnId)
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

    const formattedDate = computed({
      get: () => new Date(editedValue.value),
      set: (value) => {
        editedValue.value = value.toLocaleDateString('en-CA').slice(0, 10)
      }
    })

    return { isCalendarOpen, formattedDate, addColumn, columns, data, isAddColumnMenuOpen, newColumnName, newColumnType, onDragOver, onDragStart, onDrop, resetInput, isEditing, stopEditing, startEditing, columnType, editedValue, columnOrder }
  }
}
</script>

<style>
.board-view {
  padding: 20px 0px 20px 20px;
}

th {
  border: 1px solid #ddd;
  padding: 8px;
  cursor: move;
}

.add-column-button {
  cursor: pointer;
}

table {
  background: rgb(var(--v-theme-surface)) !important;
  border-radius: 2px;
}

table,
th,
td {
  border-collapse: collapse;
  border: 0;
  padding: 16px;
  margin: 0;
}

td {
  border: 0.2px solid #ccc;
  width: 180px;
}

.v-input__details {
  display: none !important;
}
</style>
