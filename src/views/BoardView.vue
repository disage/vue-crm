<template>
  <div class="board-view">
    <table>
      <thead>
        <tr>
          <th v-for="(column, index) in columns" :key="column.id" @dragstart="onDragStart($event, index)"
            @dragover.prevent="onDragOver" @drop="onDrop($event, index)" draggable="true">
            {{ column.name }}
          </th>
          <th>
            <div class="add-column-button">
              <v-menu v-model="isAddColumnMenuOpen" :close-on-content-click="false" location="end">
                <template v-slot:activator="{ props }">
                  <v-btn icon="mdi mdi-plus" @click="resetInput" v-bind="props" />
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
          <td v-for="(columnValue, columnName) in item.columns" :key="columnName">
            {{ columnValue }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  setup () {
    const isAddColumnMenuOpen = ref(false)
    const newColumnName = ref('')
    const newColumnType = ref('')
    const columns = ref([
      { id: 1, name: 'ID', type: 'text' },
      { id: 2, name: 'Name', type: 'text' },
      { id: 3, name: 'Age', type: 'number' },
      { id: 4, name: 'Profession', type: 'singleSelect' }
    ])
    const data = ref([
      { id: 1, columns: { column1: 1, column2: 'Alex', column3: 21, column4: 'QA' } },
      { id: 2, columns: { column1: 2, column2: 'Dima', column3: 22, column4: 'PM' } },
      { id: 3, columns: { column1: 3, column2: 'Vlad', column3: 24, column4: 'Dev' } }
    ])

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
      if (newColumnName.value.trim() !== '' && newColumnType.value.trim() !== '') {
        columns.value.push({ id: columns.value.length + 1, name: newColumnName.value, type: newColumnType.value })
        const newColumnKey = `column${columns.value.length + 1}`

        data.value.forEach(item => {
          switch (newColumnType.value.toLowerCase()) {
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

        isAddColumnMenuOpen.value = false
        newColumnName.value = ''
        newColumnType.value = ''
      }
    }

    const onDrop = (e, targetColumnIndex) => {
      const draggedColumnIndex = parseInt(e.dataTransfer.getData('text/plain'))

      if (targetColumnIndex !== draggedColumnIndex) {
        const tempColumn = columns.value.splice(draggedColumnIndex, 1)[0]
        columns.value.splice(targetColumnIndex, 0, tempColumn)

        data.value.forEach(item => {
          const columnsArray = Object.entries(item.columns)
          const temp = columnsArray[draggedColumnIndex]
          columnsArray[draggedColumnIndex] = columnsArray[targetColumnIndex]
          columnsArray[targetColumnIndex] = temp
          item.columns = Object.fromEntries(columnsArray)
        })
      }
    }

    return { addColumn, columns, data, isAddColumnMenuOpen, newColumnName, newColumnType, onDragOver, onDragStart, onDrop, resetInput }
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
}
</style>
