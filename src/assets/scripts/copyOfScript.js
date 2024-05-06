'use strict'

function updateTime() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    document.getElementById('clock').textContent = timeString
  }
  
  setInterval(updateTime, 60000)
  updateTime()
  
  document.addEventListener('DOMContentLoaded', function() {
      restoreFromLocalStorage()
  })
    
  const columns = document.querySelectorAll('.column')
    
  columns.forEach(column => {
    column.addEventListener('dragover', dragOver)
    column.addEventListener('dragenter', dragEnter)
    column.addEventListener('dragleave', dragLeave)
    column.addEventListener('drop', dragDrop)
  })
    
  let draggedCard = null
    
  function dragStart() {
    draggedCard = this
    setTimeout(() => {
      this.style.display = 'none'
    }, 0)
  }
    
    function dragEnd() {
      setTimeout(() => {
        this.style.display = 'block'
        draggedCard = null
        saveToLocalStorage()
      }, 0)
    }
    
    function dragOver(e) {
      e.preventDefault()
    }
    
    function dragEnter(e) {
      e.preventDefault()
      this.style.backgroundColor = 'rgba(0, 0, 0, 0.1)'
    }
    
    function dragLeave() {
      this.style.backgroundColor = ''
    }
    
    function dragDrop() {
      const columnId = this.getAttribute('id')
      const column = document.getElementById(columnId)
      column.appendChild(draggedCard)
      this.style.backgroundColor = ''
      updateCardButtons(draggedCard, columnId)
      saveToLocalStorage()
  }
  
  function openModal() {
    document.getElementById('card-title').value = ''
    document.getElementById('card-content').value = ''
    document.getElementById('modal').style.display = 'block'
  }
  
  function closeModal() {
    document.getElementById('modal').style.display = 'none'
  }
  
  const form = document.getElementById('card-form')
  
  form.addEventListener('submit', function(event) {
    event.preventDefault()
    const title = document.getElementById('card-title').value
    const content = document.getElementById('card-content').value
    const columnId = 'todo'
    addCard(title, content, columnId)
    closeModal()
  })
  
  function addCard(title, content, columnId) {
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

function createCard(title, content, columnId, creationTime) {
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
              button.onclick = function() {
                  moveToInProgress(newCard)
              }
              break
          case 'moveToDone':
              button.textContent = 'Move to Done'
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

  return newCard;
}

  document.querySelector('.add-btn').addEventListener('click', openModal)
  
  document.querySelector('.close').addEventListener('click', closeModal)
  
  function editCard(card, newTitle, newContent) {
    const cardTitle = card.querySelector('.card-title')
    const cardContent = card.querySelector('.card-content')
  
    cardTitle.textContent = newTitle
    cardContent.textContent = newContent
    saveToLocalStorage()
  }
  
  function openEditModal(card, title, content) {
    document.getElementById('edit-card-title').value = title
    document.getElementById('edit-card-content').value = content
  
    document.getElementById('edit-modal').style.display = 'block'
  
    document.querySelector('.close-edit').addEventListener('click', closeModalEdit)
  
    document.getElementById('edit-card-form').onsubmit = function(event) {
      event.preventDefault()
      const newTitle = document.getElementById('edit-card-title').value
      const newContent = document.getElementById('edit-card-content').value
      editCard(card, newTitle, newContent)
      closeModalEdit()
    }
  }
  
  function closeModalEdit() {
    document.getElementById('edit-modal').style.display = 'none'
  }
  
  function deleteAllCards(columnId) {
    const column = document.getElementById(columnId)
    const cards = column.querySelectorAll('.card')
    cards.forEach(card => {
      column.removeChild(card)
    })
    saveToLocalStorage()
  }

  function moveToInProgress(card) {
    const column = document.getElementById('in-progress')
    const columnId = column.getAttribute('id')
    column.appendChild(card)
    updateCardButtons(card, columnId)
    saveToLocalStorage()
}

function moveToToDo(card) {
    const column = document.getElementById('todo')
    const columnId = column.getAttribute('id')
    column.appendChild(card)
    updateCardButtons(card, columnId)
    saveToLocalStorage()
}

function moveToDone(card) {
    const column = document.getElementById('done')
    const columnId = column.getAttribute('id')
    column.appendChild(card)
    updateCardButtons(card, columnId)
    saveToLocalStorage()
}

function updateCardButtons(card, columnId) {
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
  
  function saveToLocalStorage() {
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
  
function restoreFromLocalStorage() {
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
