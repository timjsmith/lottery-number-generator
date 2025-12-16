import React, { useState } from 'react'

function Generator() {
  const [formData, setFormData] = useState({
    genString: '',
    lastWinningNumbers: '',
    regularPickTotal: 5,
    regularPickMax: 70,
    pbPickTotal: 1,
    pbPickMax: 25,
    additionalGenTotal: 0
  })

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedPreset, setSelectedPreset] = useState(null)
  const [isInfoExpanded, setIsInfoExpanded] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    if (['regularPickTotal', 'regularPickMax', 'pbPickTotal', 'pbPickMax'].includes(name)) {
      setSelectedPreset(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const lastWinningNumbers = formData.lastWinningNumbers
        .split(/[\s,]+/)
        .map(num => parseInt(num.trim()))
        .filter(num => !isNaN(num))

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lastWinningNumbers,
          genStrings: [formData.genString],
          regularPickTotal: parseInt(formData.regularPickTotal),
          regularPickMax: parseInt(formData.regularPickMax),
          pbPickTotal: parseInt(formData.pbPickTotal),
          pbPickMax: parseInt(formData.pbPickMax),
          additionalGenTotal: parseInt(formData.additionalGenTotal)
        })
      })

      if (!response.ok) {
        throw new Error('Failed to generate numbers')
      }

      const data = await response.json()
      console.log('Received data from server:', data)
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const presetGames = {
    powerball: { regularPickTotal: 5, regularPickMax: 69, pbPickTotal: 1, pbPickMax: 26 },
    megamillions: { regularPickTotal: 5, regularPickMax: 70, pbPickTotal: 1, pbPickMax: 25 },
    megabucks: { regularPickTotal: 5, regularPickMax: 41, pbPickTotal: 1, pbPickMax: 6 },
    lucky4life: { regularPickTotal: 5, regularPickMax: 48, pbPickTotal: 1, pbPickMax: 18 },
    gimme5: { regularPickTotal: 5, regularPickMax: 39, pbPickTotal: 0, pbPickMax: 0 }
  }

  const loadPreset = (game) => {
    setFormData(prev => ({
      ...prev,
      ...presetGames[game]
    }))
    setSelectedPreset(game)
  }

  const presetLabels = {
    powerball: 'Powerball',
    megamillions: 'Mega Millions',
    megabucks: 'Megabucks',
    lucky4life: 'Lucky 4 Life',
    gimme5: 'Gimme 5'
  }

  const presetLinks = {
    powerball: 'https://www.powerball.com/',
    megamillions: 'https://www.megamillions.com/',
    megabucks: 'https://www.nhlottery.com/game/megabucks',
    lucky4life: 'https://www.nhlottery.com/game/lucky-for-life',
    gimme5: 'https://www.nhlottery.com/game/gimme-five'
  }

  return (
    <div className="generator">
      <h1>Lottery Number Generator</h1>

      <div className="info-section">
        <div className="info-header" onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
          <h2>How It Works</h2>
          <button type="button" className="toggle-button">
            {isInfoExpanded ? '▼' : '▶'}
          </button>
        </div>
        {isInfoExpanded && (
          <div className="info-content">
            <div className="info-item">
              <strong>Generation String:</strong>
              <p>Your text input is converted to a numeric value by summing the alphabetical positions of each letter (a=1, b=2, etc.). This number determines how many random number sets to generate.</p>
            </div>
            <div className="info-item">
              <strong>Previous Winning Numbers:</strong>
              <p>The sum of your last winning numbers is added to the generation string value to calculate the total iterations.</p>
            </div>
            <div className="info-item">
              <strong>The Algorithm:</strong>
              <p>Random number sets are generated for the calculated number of iterations. The numbers that appear most frequently across all iterations are selected as your winning picks.</p>
            </div>
            <div className="info-item">
              <strong>Additional Generation Total:</strong>
              <p>This value is added to the total number of iterations. Use this to increase the sample size for more randomness or when you want to generate more iterations than the string and previous numbers provide.</p>
            </div>
          </div>
        )}
      </div>

      <div className="presets">
        <h3>
          Quick Presets:
          {selectedPreset && (
            <>
              <span className="selected-preset-label">{presetLabels[selectedPreset]} selected</span>
              <a href={presetLinks[selectedPreset]} target="_blank" rel="noopener noreferrer" className="preset-link">
                🔗
              </a>
            </>
          )}
        </h3>
        <div className="preset-buttons">
          <button
            onClick={() => loadPreset('powerball')}
            className={selectedPreset === 'powerball' ? 'active' : ''}
          >
            Powerball
          </button>
          <button
            onClick={() => loadPreset('megamillions')}
            className={selectedPreset === 'megamillions' ? 'active' : ''}
          >
            Mega Millions
          </button>
          <button
            onClick={() => loadPreset('megabucks')}
            className={selectedPreset === 'megabucks' ? 'active' : ''}
          >
            Megabucks
          </button>
          <button
            onClick={() => loadPreset('lucky4life')}
            className={selectedPreset === 'lucky4life' ? 'active' : ''}
          >
            Lucky 4 Life
          </button>
          <button
            onClick={() => loadPreset('gimme5')}
            className={selectedPreset === 'gimme5' ? 'active' : ''}
          >
            Gimme 5
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="genString">Generation String:</label>
          <textarea
            id="genString"
            name="genString"
            value={formData.genString}
            onChange={handleInputChange}
            placeholder="Enter your generation string..."
            rows="4"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastWinningNumbers">Last Winning Numbers (comma or space-separated):</label>
          <input
            type="text"
            id="lastWinningNumbers"
            name="lastWinningNumbers"
            value={formData.lastWinningNumbers}
            onChange={handleInputChange}
            placeholder="e.g., 8,32,52,56,64,23 or 8 32 52 56 64 23"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="regularPickTotal">Regular Pick Count:</label>
            <input
              type="number"
              id="regularPickTotal"
              name="regularPickTotal"
              value={formData.regularPickTotal}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="regularPickMax">Regular Pick Max:</label>
            <input
              type="number"
              id="regularPickMax"
              name="regularPickMax"
              value={formData.regularPickMax}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="pbPickTotal">Powerball Pick Count:</label>
            <input
              type="number"
              id="pbPickTotal"
              name="pbPickTotal"
              value={formData.pbPickTotal}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pbPickMax">Powerball Pick Max:</label>
            <input
              type="number"
              id="pbPickMax"
              name="pbPickMax"
              value={formData.pbPickMax}
              onChange={handleInputChange}
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="additionalGenTotal">
            Additional Generation Total:
            <span className="tooltip">
              <span className="tooltip-icon">ⓘ</span>
              <span className="tooltip-text">
                This number gets added to your total iterations. You can use any value - popular choices include jackpot odds (e.g., 292,201,338 for Powerball) or the current jackpot amount.
              </span>
            </span>
          </label>
          <input
            type="number"
            id="additionalGenTotal"
            name="additionalGenTotal"
            value={formData.additionalGenTotal}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Generating...' : 'Generate Numbers'}
        </button>
      </form>

      {error && (
        <div className="error">
          <h3>Error:</h3>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div className="result">
          <h2>Your Winning Numbers:</h2>
          <div className="numbers">
            <div className="main-numbers">
              {result.winingNumbers.map((num, idx) => (
                <span key={idx} className="number">{num}</span>
              ))}
            </div>
            {result.winningPB && result.winningPB.length > 0 && (
              <div className="pb-numbers">
                <span className="label">Powerball:</span>
                {result.winningPB.map((num, idx) => (
                  <span key={idx} className="number powerball">{num}</span>
                ))}
              </div>
            )}
          </div>

          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Total Iterations:</span>
              <span className="stat-value">{result.totalIterations?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Time Elapsed:</span>
              <span className="stat-value">{result.timeElapsedSeconds ? `${result.timeElapsedSeconds}s` : 'N/A'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Generator
