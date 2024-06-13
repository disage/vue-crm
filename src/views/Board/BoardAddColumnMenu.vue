<template>
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
</template>

<script>
import { toRef } from 'vue'
import useBoardView from './useBoardView.js'

export default {
  props: {
    boardColumns: {
      type: Array,
      required: true
    },
    boardData: {
      type: Array,
      required: true
    }
  },
  setup (props) {
    const columns = toRef(props.boardColumns)
    const data = toRef(props.boardData)
    // const boardOrder = toRef(props.boardOrder)
    const { isAddColumnMenuOpen, resetInput, newColumnName, newColumnType, addColumn } = useBoardView(columns, data)

    return { isAddColumnMenuOpen, resetInput, newColumnName, newColumnType, addColumn }
  }
}
</script>
