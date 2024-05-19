export function updateTime() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, '0')
    const minutes = String(now.getMinutes()).padStart(2, '0')
    const timeString = `${hours}:${minutes}`
    const clockElement = document.getElementById('clock')
    if (clockElement) {
        clockElement.textContent = timeString
    }
}

export function startClock() {
    setInterval(updateTime, 20000)
    updateTime()
}