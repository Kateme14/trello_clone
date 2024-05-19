import { dragStart, dragEnd } from './dragDrop.js'
import { saveToLocalStorage } from './script.js'
import { moveToInProgress, moveToDone, moveToToDo } from './cardActions.js'
import { openEditModal } from './modal.js'

export function createCard(title, content, columnId, creationTime) {
    const newCard = document.createElement('div')
    newCard.classList.add('card')
    newCard.draggable = true
  
    const cardTitle = document.createElement('h4')
    cardTitle.classList.add('card-title')
    cardTitle.textContent = title
  
    const cardContent = document.createElement('div')
    cardContent.classList.add('card-content')
    cardContent.textContent = content
  
    const cardTime = document.createElement('div')
    cardTime.classList.add('card-time')
    cardTime.textContent = "Created at: " + creationTime
  
    const cardButtons = document.createElement('div')
    cardButtons.classList.add('card-buttons')
  
    let buttonsOrder = []
    if (columnId === 'todo') {
        buttonsOrder = ['edit', 'moveToInProgress', 'moveToDone', 'delete']
    } else if (columnId === 'in-progress') {
        buttonsOrder = ['moveToToDo', 'moveToDone']
    } else if (columnId === 'done') {
        buttonsOrder = ['moveToToDo', 'moveToInProgress', 'delete']
    }
  
    buttonsOrder.forEach(buttonType => {
        const button = document.createElement('button')
        button.classList.add(`${buttonType}-button`)
        if (columnId === 'todo') {
            button.classList.add('todo-button')
        }
        switch (buttonType) {
            case 'edit':
                button.textContent = 'Edit'
                button.onclick = function() {
                    openEditModal(newCard, title, content)
                }
                break
            case 'moveToToDo':
                button.textContent = 'Move to To Do'
                button.onclick = function() {
                    moveToToDo(newCard)
                }
                break
            case 'moveToInProgress':
                button.textContent = 'Move to In Progress'
                button.classList.add('move-to-in-progress-btn')
                button.onclick = function() {
                    moveToInProgress(newCard)
                }
                break
            case 'moveToDone':
                button.textContent = 'Move to Done'
                button.classList.add('move-to-done-btn')
                button.onclick = function() {
                    moveToDone(newCard)
                }
                break
            case 'delete':
                button.textContent = 'Delete'
                button.onclick = function() {
                    const card = this.parentElement.parentElement
                    const column = card.parentElement
                    column.removeChild(card)
                    saveToLocalStorage()
                }
                break
        }
        cardButtons.appendChild(button)
    })
  
    newCard.appendChild(cardButtons)
    newCard.appendChild(cardTitle)
    newCard.appendChild(cardContent)
    const spacer = document.createElement('div')
    spacer.style.marginBottom = '1em'
    newCard.appendChild(spacer)
    newCard.appendChild(cardTime)
  
    newCard.addEventListener('dragstart', dragStart)
    newCard.addEventListener('dragend', dragEnd)
  
    return newCard
}
  