import { ref, computed, onMounted, onBeforeUnmount, reactive } from 'vue'
import { nanoid } from 'nanoid'

export default function useBoardView (columns, data) {
  const isColumnSettingsMenuOpen = ref(Array(data.value.length).fill(false))

  const updateColumnSettingsMenuStatus = (index) => {
    isColumnSettingsMenuOpen.value[index] = !isColumnSettingsMenuOpen.value[index]
  }
  // Hooks
  onMounted(() => {
    window.addEventListener('mousemove', updateCursorPosition)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', updateCursorPosition)
  })

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
    isColumnSettingsMenuOpen.value = isColumnSettingsMenuOpen.value.map(() => false)
    const event = window.event
    dragPosition.left = event.clientX
    dragPosition.top = event.clientY
    selectedIndex.value = index
    selectedColumn.value = document.querySelectorAll('th')[index]
    columnWidth.value = selectedColumn.value.offsetWidth
    const columnRect = selectedColumn.value.getBoundingClientRect()
    mouseX.value = columnRect.left + columnRect.width / 2
    mouseY.value = columnRect.top + columnRect.height / 2
    document.addEventListener('mousemove', onMouseMoveForDrag)
    document.addEventListener('mouseup', onMouseUp)
  }

  const onMouseMoveForDrag = (event) => {
    const deltaX = event.clientX - dragPosition.left
    const deltaY = event.clientY - dragPosition.top

    // Threshold for detecting drag (e.g., 5 pixels)
    if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      document.removeEventListener('mousemove', onMouseMoveForDrag)
      startDrag(event)
    }
  }
  const startDrag = () => {
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
    document.removeEventListener('mousemove', onMouseMoveForDrag)
    isDragging.value = false
    if (selectedColumn.value) {
      selectedColumn.value.classList.remove('dragging')
    }
    const hoveredIndex = getHoveredIndex(selectedIndex.value)
    const columnsElement = document.querySelectorAll('th')
    for (let i = 0; i < columnsElement.length; i++) {
      if (i !== selectedIndex.value) {
        columnsElement[i].classList.remove('hovered')
      }
    }
    if (hoveredIndex !== null && hoveredIndex !== selectedIndex.value) {
      const columnToMove = columns.value[selectedIndex.value]
      columns.value.splice(selectedIndex.value, 1) // remove selected column from current pos

      // new pos for inserting
      let newIndex = hoveredIndex + 1
      if (hoveredIndex < selectedIndex.value) {
        newIndex -= 1
      }

      columns.value.splice(newIndex, 0, columnToMove) // insert column on new pos
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
    const newColumnKey = nanoid()
    if (newColumnName.value.trim() !== '' && newColumnType.value.trim() !== '') {
      columns.value.push({ key: `col_${newColumnKey}`, title: newColumnName.value, type: newColumnType.value.replace(/\s/g, '').toLowerCase(), width: 100 })
      // options: newColumnType.value === 'singleselect' ? null : ['test', 'PM', 'FE DEV', 'BE DEV', 'UI UX']
      data.value.forEach(item => {
        switch (newColumnType.value) {
          case 'text':
          case 'email':
          case 'singleselect':
          case 'multiselect':
            item[`col_${newColumnKey}`] = 'test'
            break
          case 'number':
          case 'phone':
            item[`col_${newColumnKey}`] = 0
            break
          default:
            item[`col_${newColumnKey}`] = ''
        }
      })
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

  const startResize = (columnId) => {
    resizingColumnIndex = columnId
    startX = event.pageX
    document.addEventListener('mousemove', resize)
    document.addEventListener('mouseup', stopResize)
  }

  const resize = (event) => {
    if (resizingColumnIndex !== null) {
      const delta = event.pageX - startX
      const column = getColumnById(resizingColumnIndex)
      const newWidth = column.width + delta

      // Set min width 100px
      column.width = Math.max(newWidth, 100)

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
    return columns.value.find(column => column.key === columnId)
  }

  return {
    isColumnSettingsMenuOpen,
    updateColumnSettingsMenuStatus,
    addColumn,
    columns,
    columnWidth,
    data,
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
