import { updateCardButtons, saveToLocalStorage } from './script.js'

let draggedCard = null

export function dragStart() {
    draggedCard = this
    setTimeout(() => {
      this.style.display = 'none'
    }, 0)
  }
  
  export function dragEnd() {
    setTimeout(() => {
      this.style.display = 'block'
      draggedCard = null
      saveToLocalStorage()
    }, 0)
  }
  
  export function dragOver(e) {
    e.preventDefault()
  }
  
  export function dragEnter(e) {
    e.preventDefault()
    this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
  }
  
  export function dragLeave() {
    this.style.backgroundColor = ''
  }
  
  export function dragDrop() {
    const columnId = this.getAttribute('id')
    const column = document.getElementById(columnId)
    column.appendChild(draggedCard)
    this.style.backgroundColor = ''
    updateCardButtons(draggedCard, columnId)
    saveToLocalStorage()
  }
  