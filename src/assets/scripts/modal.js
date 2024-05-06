
export function openModal() {
    document.getElementById('card-title').value = ''
    document.getElementById('card-content').value = ''
    document.getElementById('modal').style.display = 'block'
}

export function closeModal() {
    document.getElementById('modal').style.display = 'none'
}


export function openEditModal(card, title, content) {
    document.getElementById('edit-card-title').value = title
    document.getElementById('edit-card-content').value = content
    document.getElementById('edit-modal').style.display = 'block'

    document.querySelector('.close-edit').addEventListener('click', closeModalEdit)

    document.getElementById('edit-card-form').onsubmit = function(event) {
        event.preventDefault();
        const newTitle = document.getElementById('edit-card-title').value
        const newContent = document.getElementById('edit-card-content').value
        editCard(card, newTitle, newContent)
        closeModalEdit()
    };
}

export function closeModalEdit() {
    document.getElementById('edit-modal').style.display = 'none'
}
