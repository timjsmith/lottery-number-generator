const HISTORY_KEY = 'lottery_picker_history'

export const saveToHistory = (entry) => {
  try {
    const history = getHistory()
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry
    }
    history.unshift(newEntry) // Add to beginning

    // Keep only last 100 entries
    const trimmedHistory = history.slice(0, 100)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmedHistory))
    return newEntry
  } catch (error) {
    console.error('Error saving to history:', error)
    return null
  }
}

export const getHistory = () => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY)
    return historyJson ? JSON.parse(historyJson) : []
  } catch (error) {
    console.error('Error reading history:', error)
    return []
  }
}

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
    return true
  } catch (error) {
    console.error('Error clearing history:', error)
    return false
  }
}

export const deleteHistoryEntry = (id) => {
  try {
    const history = getHistory()
    const filtered = history.filter(entry => entry.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered))
    return true
  } catch (error) {
    console.error('Error deleting history entry:', error)
    return false
  }
}
