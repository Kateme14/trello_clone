import { updateCardButtons, saveToLocalStorage } from './script.js'

export function moveToInProgress(card) {
    const column = document.getElementById('in-progress')
    const columnId = column.getAttribute('id')
    column.appendChild(card)
    updateCardButtons(card, columnId)
    saveToLocalStorage()
}

export function moveToToDo(card) {
    const column = document.getElementById('todo')
    const columnId = column.getAttribute('id')
    column.appendChild(card)
    updateCardButtons(card, columnId)
    saveToLocalStorage()
}

export function moveToDone(card) {
    const column = document.getElementById('done')
    const columnId = column.getAttribute('id')
    column.appendChild(card)
    updateCardButtons(card, columnId)
    saveToLocalStorage()
}
