import { editCard } from './script.js'

export function openModal() {
    document.getElementById('card-title').value = ''
    document.getElementById('card-content').value = ''
    document.getElementById('modal').style.display = 'block'
}

export function closeModal() {
    document.getElementById('modal').style.display = 'none'
}
export function openEditModal(card) {
    const currentTitle = card.querySelector('.card-title').textContent
    const currentContent = card.querySelector('.card-content').textContent

    document.getElementById('edit-card-title').value = currentTitle
    document.getElementById('edit-card-content').value = currentContent

    document.getElementById('edit-modal').style.display = 'block'
    document.querySelector('.close-edit').addEventListener('click', closeModalEdit)

    const editForm = document.getElementById('edit-card-form')
    editForm.onsubmit = null

    editForm.onsubmit = function(event) {
        event.preventDefault()
        const newTitle = document.getElementById('edit-card-title').value
        const newContent = document.getElementById('edit-card-content').value
        editCard(card, newTitle, newContent)
        closeModalEdit()
    }
}

export function closeModalEdit() {
    document.getElementById('edit-modal').style.display = 'none'
}
