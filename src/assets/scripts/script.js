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
  });
    
  const columns = document.querySelectorAll('.column')
    
  columns.forEach(column => {
    column.addEventListener('dragover', dragOver)
    column.addEventListener('dragenter', dragEnter)
    column.addEventListener('dragleave', dragLeave)
    column.addEventListener('drop', dragDrop)
  });
    
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
    event.preventDefault();
    const title = document.getElementById('card-title').value
    const content = document.getElementById('card-content').value
    addCard(title, content)
    closeModal()
  });
  
  function addCard(title, content) {
    const column = document.getElementById('todo');
    if (column.children.length === 0 || (column.children.length === 1 && column.children[0].classList.contains('placeholder'))) {
      column.innerHTML = ''
    }
    if (title && content) {
      const newCard = createCard(title, content)
      column.appendChild(newCard)
      saveToLocalStorage()
    }
  }
    
    function createCard(title, content) {
      const newCard = document.createElement('div')
      newCard.classList.add('card')
      newCard.draggable = true
  
      const cardTitle = document.createElement('h4')
      cardTitle.classList.add('card-title')
      cardTitle.textContent = title;
  
      const cardContent = document.createElement('div')
      cardContent.classList.add('card-content')
      cardContent.textContent = content
  
      const cardTime = document.createElement('div')
      cardTime.classList.add('card-time')
      const currentTime = new Date()
      const timeString = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`
      cardTime.textContent = "Created at: " + timeString
  
      const cardButtons = document.createElement('div')
      cardButtons.classList.add('card-buttons')
  
      const editButton = document.createElement('button')
      editButton.textContent = 'Edit'
      editButton.classList.add('edit-button')
      editButton.onclick = function() {
       openEditModal(newCard, title, content)
      }
  
      const deleteButton = document.createElement('button')
      deleteButton.textContent = 'Delete'
      deleteButton.classList.add('delete-button')
      deleteButton.onclick = function() {
        const card = this.parentElement.parentElement
        const column = card.parentElement
        column.removeChild(card)
        saveToLocalStorage()
      };
  
      cardButtons.appendChild(editButton)
      cardButtons.appendChild(deleteButton)
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
  
  
  function saveToLocalStorage() {
    columns.forEach((column, index) => {
        const columnId = column.getAttribute('id')
        const cardTexts = Array.from(column.children)
            .map(card => {
                const cardTitle = card.querySelector('.card-title')
                const cardContent = card.querySelector('.card-content')
                const title = cardTitle ? cardTitle.textContent : ''
                const content = cardContent ? cardContent.textContent : ''
                return { title, content }
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
            const newCard = createCard(cardText.title, cardText.content)
            column.appendChild(newCard)
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