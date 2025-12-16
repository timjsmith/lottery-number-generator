import React, { useState, useEffect } from 'react'
import './RandomPicker.css'

function RandomPicker() {
  const [gameConfig, setGameConfig] = useState({
    regularPickTotal: 5,
    regularPickMax: 70,
    pbPickTotal: 1,
    pbPickMax: 25
  })

  const [selectedPreset, setSelectedPreset] = useState(null)
  const [shuffledRegularNumbers, setShuffledRegularNumbers] = useState([])
  const [shuffledPBNumbers, setShuffledPBNumbers] = useState([])
  const [selectedRegularBoxes, setSelectedRegularBoxes] = useState([])
  const [selectedPBBoxes, setSelectedPBBoxes] = useState([])
  const [finalPicks, setFinalPicks] = useState(null)

  const presetGames = {
    powerball: { regularPickTotal: 5, regularPickMax: 69, pbPickTotal: 1, pbPickMax: 26 },
    megamillions: { regularPickTotal: 5, regularPickMax: 70, pbPickTotal: 1, pbPickMax: 25 },
    megabucks: { regularPickTotal: 5, regularPickMax: 41, pbPickTotal: 1, pbPickMax: 6 },
    lucky4life: { regularPickTotal: 5, regularPickMax: 48, pbPickTotal: 1, pbPickMax: 18 },
    gimme5: { regularPickTotal: 5, regularPickMax: 39, pbPickTotal: 0, pbPickMax: 0 }
  }

  const presetLabels = {
    powerball: 'Powerball',
    megamillions: 'Mega Millions',
    megabucks: 'Megabucks',
    lucky4life: 'Lucky 4 Life',
    gimme5: 'Gimme 5'
  }

  // Shuffle array using Fisher-Yates algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  // Initialize shuffled numbers when config changes
  useEffect(() => {
    const regularNumbers = Array.from({ length: gameConfig.regularPickMax }, (_, i) => i + 1)
    const pbNumbers = gameConfig.pbPickMax > 0
      ? Array.from({ length: gameConfig.pbPickMax }, (_, i) => i + 1)
      : []

    setShuffledRegularNumbers(shuffleArray(regularNumbers))
    setShuffledPBNumbers(shuffleArray(pbNumbers))
    setSelectedRegularBoxes([])
    setSelectedPBBoxes([])
    setFinalPicks(null)
  }, [gameConfig])

  const loadPreset = (game) => {
    setGameConfig(presetGames[game])
    setSelectedPreset(game)
  }

  const handleRegularBoxClick = (index) => {
    if (selectedRegularBoxes.includes(index)) {
      setSelectedRegularBoxes(selectedRegularBoxes.filter(i => i !== index))
    } else if (selectedRegularBoxes.length < gameConfig.regularPickTotal) {
      setSelectedRegularBoxes([...selectedRegularBoxes, index])
    }
  }

  const handlePBBoxClick = (index) => {
    if (selectedPBBoxes.includes(index)) {
      setSelectedPBBoxes(selectedPBBoxes.filter(i => i !== index))
    } else if (selectedPBBoxes.length < gameConfig.pbPickTotal) {
      setSelectedPBBoxes([...selectedPBBoxes, index])
    }
  }

  const handleConfirmSelection = () => {
    const regularPicks = selectedRegularBoxes.map(index => shuffledRegularNumbers[index]).sort((a, b) => a - b)
    const pbPicks = selectedPBBoxes.map(index => shuffledPBNumbers[index])

    setFinalPicks({
      regularNumbers: regularPicks,
      pbNumbers: pbPicks
    })

    // Scroll to top to show results
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleReShuffle = () => {
    const regularNumbers = Array.from({ length: gameConfig.regularPickMax }, (_, i) => i + 1)
    const pbNumbers = gameConfig.pbPickMax > 0
      ? Array.from({ length: gameConfig.pbPickMax }, (_, i) => i + 1)
      : []

    setShuffledRegularNumbers(shuffleArray(regularNumbers))
    setShuffledPBNumbers(shuffleArray(pbNumbers))
    setSelectedRegularBoxes([])
    setSelectedPBBoxes([])
    setFinalPicks(null)
  }

  const isConfirmEnabled = selectedRegularBoxes.length === gameConfig.regularPickTotal &&
    (gameConfig.pbPickTotal === 0 || selectedPBBoxes.length === gameConfig.pbPickTotal)

  return (
    <div className="random-picker">
      <div className="container">
        <h1>Random Picker</h1>

        <div className="info-box">
          <p>Click on boxes to select your numbers randomly. Each box contains a hidden number that will be revealed when you confirm your selection.</p>
        </div>

        {finalPicks && (
          <div className="final-picks">
            <h2>Your Selected Numbers:</h2>
            <div className="numbers">
              <div className="main-numbers">
                {finalPicks.regularNumbers.map((num, idx) => (
                  <span key={idx} className="number">{num}</span>
                ))}
              </div>
              {finalPicks.pbNumbers.length > 0 && (
                <div className="pb-numbers">
                  <span className="label">Powerball:</span>
                  {finalPicks.pbNumbers.map((num, idx) => (
                    <span key={idx} className="number powerball">{num}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="presets">
          <h3>
            Quick Presets:
            {selectedPreset && (
              <span className="selected-preset-label">{presetLabels[selectedPreset]} selected</span>
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

        <div className="selection-info">
          <div className="selection-status">
            <span>Regular Numbers: {selectedRegularBoxes.length} / {gameConfig.regularPickTotal}</span>
            {gameConfig.pbPickTotal > 0 && (
              <span>Powerball: {selectedPBBoxes.length} / {gameConfig.pbPickTotal}</span>
            )}
          </div>
          <div className="action-buttons">
            <button onClick={handleReShuffle} className="reshuffle-btn">
              Reshuffle All Boxes
            </button>
            <button
              onClick={handleConfirmSelection}
              disabled={!isConfirmEnabled}
              className="confirm-btn"
            >
              Confirm Selection
            </button>
          </div>
        </div>

        <div className="picker-section">
          <h3>Regular Numbers (Select {gameConfig.regularPickTotal})</h3>
          <div className="number-grid">
            {shuffledRegularNumbers.map((number, index) => (
              <div
                key={index}
                className={`number-box ${selectedRegularBoxes.includes(index) ? 'selected' : ''}`}
                onClick={() => handleRegularBoxClick(index)}
              >
                {selectedRegularBoxes.includes(index) ? number : '?'}
              </div>
            ))}
          </div>
        </div>

        {gameConfig.pbPickTotal > 0 && (
          <div className="picker-section">
            <h3>Powerball Numbers (Select {gameConfig.pbPickTotal})</h3>
            <div className="number-grid pb-grid">
              {shuffledPBNumbers.map((number, index) => (
                <div
                  key={index}
                  className={`number-box pb-box ${selectedPBBoxes.includes(index) ? 'selected' : ''}`}
                  onClick={() => handlePBBoxClick(index)}
                >
                  {selectedPBBoxes.includes(index) ? number : '?'}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RandomPicker
