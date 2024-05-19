import { startClock } from './clock.js'
import { createCard } from './card.js'
import { dragStart, dragEnd, dragOver, dragEnter, dragLeave, dragDrop } from './dragDrop.js'
import { moveToInProgress, moveToToDo, moveToDone } from './cardActions.js'
import { openModal, closeModal, openEditModal, closeModalEdit } from './modal.js'
  
document.addEventListener('DOMContentLoaded', function() {
  const root = document.getElementById("root")
  startClock()  
  restoreFromLocalStorage()
})
    

document.querySelector('.add-btn').addEventListener('click', function() {
  openModal()
})

document.querySelector('.delete-all-btn').addEventListener('click', function() {
    deleteAllCards('done')
})

const columns = document.querySelectorAll('.column')
    
columns.forEach(column => {
  column.addEventListener('dragover', dragOver)
  column.addEventListener('dragenter', dragEnter)
  column.addEventListener('dragleave', dragLeave)
  column.addEventListener('drop', dragDrop)
})
  
const form = document.getElementById('card-form')

form.addEventListener('submit', function(event) {
  event.preventDefault()
  const title = document.getElementById('card-title').value
  const content = document.getElementById('card-content').value
  const columnId = 'todo'
  addCard(title, content, columnId)
  closeModal()
})

export function addCard(title, content, columnId) {
  const column = document.getElementById(columnId)
  if (!column) {
    console.error(`Column with id '${columnId}' not found.`)
    return
  }
  if (column.children.length === 0 || (column.children.length === 1 && column.children[0].classList.contains('placeholder'))) {
    column.innerHTML = ''
  }
  if (title && content) {
    const currentTime = new Date()
    const creationTime = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`
    const newCard = createCard(title, content, columnId, creationTime)
    column.appendChild(newCard)
    saveToLocalStorage()
  }
}

document.querySelector('.add-btn').addEventListener('click', openModal)

document.querySelector('.close').addEventListener('click', closeModal)

export function editCard(card, newTitle, newContent) {
  const cardTitle = card.querySelector('.card-title')
  const cardContent = card.querySelector('.card-content')

  cardTitle.textContent = newTitle
  cardContent.textContent = newContent
  saveToLocalStorage()
}


export function deleteAllCards(columnId) {
  const column = document.getElementById(columnId)
  const cards = column.querySelectorAll('.card')
  cards.forEach(card => {
    column.removeChild(card)
  })
  saveToLocalStorage()
}

export function updateCardButtons(card, columnId) {
  const cardButtons = card.querySelector('.card-buttons')
  cardButtons.innerHTML = ''

  if (columnId === 'todo') {
      const editButton = document.createElement('button')
      editButton.textContent = 'Edit'
      editButton.classList.add('edit-button')
      editButton.onclick = function() {
          openEditModal(card, card.querySelector('.card-title').textContent, card.querySelector('.card-content').textContent)
      }
      cardButtons.appendChild(editButton)
      const moveToInProgressButton = document.createElement('button')
      moveToInProgressButton.textContent = 'Move to In Progress'
      moveToInProgressButton.classList.add('move-to-in-progress-btn')
      moveToInProgressButton.onclick = function() {
          moveToInProgress(card)
      }
      cardButtons.appendChild(moveToInProgressButton)
      const moveToDoneButton = document.createElement('button')
      moveToDoneButton.textContent = 'Move to Done'
      moveToDoneButton.classList.add('move-to-done-btn')
      moveToDoneButton.onclick = function() {
          moveToDone(card)
      }
      cardButtons.appendChild(moveToDoneButton)
      const deleteButton = document.createElement('button')
      deleteButton.textContent = 'Delete'
      deleteButton.classList.add('delete-button')
      deleteButton.onclick = function() {
          const column = card.parentElement
          column.removeChild(card)
          saveToLocalStorage()
      }
      cardButtons.appendChild(deleteButton)
  } else if (columnId === 'in-progress') {
      const moveToToDoButton = document.createElement('button')
      moveToToDoButton.textContent = 'Move to To Do'
      moveToToDoButton.classList.add('move-to-todo-btn')
      moveToToDoButton.onclick = function() {
          moveToToDo(card)
      }
      cardButtons.appendChild(moveToToDoButton)
      const moveToDoneButton = document.createElement('button')
      moveToDoneButton.textContent = 'Move to Done'
      moveToDoneButton.classList.add('move-to-done-btn')
      moveToDoneButton.onclick = function() {
          moveToDone(card)
      }
      cardButtons.appendChild(moveToDoneButton)
  } else if (columnId === 'done') {
      const moveToToDoButton = document.createElement('button')
      moveToToDoButton.textContent = 'Move to To Do'
      moveToToDoButton.classList.add('move-to-todo-btn')
      moveToToDoButton.onclick = function() {
          moveToToDo(card)
      }
      cardButtons.appendChild(moveToToDoButton)
      const moveToInProgressButton = document.createElement('button')
      moveToInProgressButton.textContent = 'Move to In progress'
      moveToInProgressButton.classList.add('move-to-in-progress-btn')
      moveToInProgressButton.onclick = function() {
          moveToInProgress(card)
      }
      cardButtons.appendChild(moveToInProgressButton)
      const deleteButton = document.createElement('button')
      deleteButton.textContent = 'Delete'
      deleteButton.classList.add('delete-button')
      deleteButton.onclick = function() {
          const column = card.parentElement
          column.removeChild(card)
          saveToLocalStorage()
      }
      cardButtons.appendChild(deleteButton)
  }
}
  
export function saveToLocalStorage() {
  columns.forEach((column, index) => {
    const columnId = column.getAttribute('id')
    const cardTexts = Array.from(column.children)
      .map(card => {
        const cardTitle = card.querySelector('.card-title')
        const cardContent = card.querySelector('.card-content')
        const title = cardTitle ? cardTitle.textContent : ''
        const content = cardContent ? cardContent.textContent : ''
        const cardTime = card.querySelector('.card-time')
        const creationTime = cardTime ? cardTime.textContent.replace("Created at: ", "") : ''
        return { title, content, creationTime }
      })
      .filter(card => card.title.trim() !== "" || card.content.trim() !== "")
    localStorage.setItem(columnId, JSON.stringify(cardTexts))
  })
}
  
export function restoreFromLocalStorage() {
  columns.forEach(column => {
    const columnId = column.getAttribute('id')
    const cardTexts = JSON.parse(localStorage.getItem(columnId))
    if (cardTexts) {
      cardTexts.forEach(cardText => {
        if (cardText.title.trim() !== "" || cardText.content.trim() !== "") {
          const newCard = createCard(cardText.title, cardText.content, columnId, cardText.creationTime)
          column.appendChild(newCard)
          updateCardButtons(newCard, columnId)
        }
      })
    }
  })
}

async function getUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users')
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    const users = await response.json()
    return users;
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const users = await getUsers()
  console.log('Users:', users)
})
