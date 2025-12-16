import { useState, useEffect } from 'react'
import { getHistory, clearHistory, deleteHistoryEntry } from '../utils/historyStorage'
import './History.css'

function History() {
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = () => {
    const historyData = getHistory()
    setHistory(historyData)
  }

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all history? This cannot be undone.')) {
      clearHistory()
      setHistory([])
    }
  }

  const handleDelete = (id) => {
    deleteHistoryEntry(id)
    setHistory(history.filter(entry => entry.id !== id))
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const getMethodLabel = (method) => {
    const labels = {
      generator: 'Algorithm Generator',
      randomPicker: 'Random Picker',
      ballDrop: 'Ball Drop Game'
    }
    return labels[method] || method
  }

  const getPresetLabel = (preset) => {
    const labels = {
      powerball: 'Powerball',
      megamillions: 'Mega Millions',
      megabucks: 'Megabucks',
      lucky4life: 'Lucky 4 Life',
      gimme5: 'Gimme 5'
    }
    return labels[preset] || 'Custom'
  }

  return (
    <div className="history">
      <div className="history-header">
        <h1>Pick History</h1>
        {history.length > 0 && (
          <button onClick={handleClearAll} className="clear-all-btn">
            Clear All History
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="empty-state">
          <p>No picks saved yet. Generate some numbers to see them here!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((entry) => (
            <div key={entry.id} className="history-card">
              <div className="history-card-header">
                <div className="history-meta">
                  <span className="history-method">{getMethodLabel(entry.method)}</span>
                  {entry.preset && (
                    <span className="history-preset">{getPresetLabel(entry.preset)}</span>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(entry.id)}
                  className="delete-btn"
                  title="Delete this entry"
                >
                  ×
                </button>
              </div>

              <div className="history-timestamp">
                {formatDate(entry.timestamp)}
              </div>

              <div className="history-numbers">
                <div className="main-numbers">
                  {entry.regularNumbers.map((num, idx) => (
                    <span key={idx} className="number">{num}</span>
                  ))}
                </div>
                {entry.powerballNumbers && entry.powerballNumbers.length > 0 && (
                  <div className="pb-numbers">
                    <span className="label">Powerball:</span>
                    {entry.powerballNumbers.map((num, idx) => (
                      <span key={idx} className="number powerball">{num}</span>
                    ))}
                  </div>
                )}
              </div>

              {entry.stats && (
                <div className="history-stats">
                  {entry.stats.totalIterations && (
                    <span className="stat">
                      Iterations: {entry.stats.totalIterations.toLocaleString()}
                    </span>
                  )}
                  {entry.stats.timeElapsed && (
                    <span className="stat">
                      Time: {entry.stats.timeElapsed}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default History
