import { useState, useEffect, useRef } from 'react'
import Matter from 'matter-js'
import { saveToHistory } from '../utils/historyStorage'
import './BallDrop.css'

function BallDrop() {
  const [gameConfig, setGameConfig] = useState({
    regularPickTotal: 5,
    regularPickMax: 69,
    pbPickTotal: 1,
    pbPickMax: 26
  })

  const [selectedPreset, setSelectedPreset] = useState('powerball')
  const [gamePhase, setGamePhase] = useState('setup') // setup, regular, powerball, complete
  const [droppedBalls, setDroppedBalls] = useState(0)
  const [regularPicks, setRegularPicks] = useState([])
  const [pbPick, setPbPick] = useState(null)
  const [slotNumbers, setSlotNumbers] = useState([])
  const [pbSlotNumbers, setPbSlotNumbers] = useState([])
  const [isBallDropping, setIsBallDropping] = useState(false)

  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const renderRef = useRef(null)
  const slotsRef = useRef([])
  const ballsRef = useRef([])
  const slotNumbersRef = useRef([])
  const pbSlotNumbersRef = useRef([])
  const gamePhaseRef = useRef('setup')

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

  const loadPreset = (game) => {
    setGameConfig(presetGames[game])
    setSelectedPreset(game)
    resetGame()
  }

  const shuffleArray = (array) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }

  const resetGame = () => {
    setGamePhase('setup')
    gamePhaseRef.current = 'setup'
    setDroppedBalls(0)
    setRegularPicks([])
    setPbPick(null)
    setSlotNumbers([])
    setPbSlotNumbers([])
    setIsBallDropping(false)

    if (engineRef.current) {
      Matter.World.clear(engineRef.current.world)
      Matter.Engine.clear(engineRef.current)
    }
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current)
      renderRef.current.canvas.remove()
      renderRef.current = null
    }
    slotsRef.current = []
    ballsRef.current = []
    slotNumbersRef.current = []
    pbSlotNumbersRef.current = []
  }

  const initializePhysics = (isRegular) => {
    if (!canvasRef.current) return

    const width = 800
    const height = 600
    const numSlots = 10
    const wallThickness = 20
    const usableWidth = width - (wallThickness * 2)
    const slotWidth = usableWidth / numSlots

    const Engine = Matter.Engine
    const Render = Matter.Render
    const World = Matter.World
    const Bodies = Matter.Bodies
    const Runner = Matter.Runner

    // Create engine
    const engine = Engine.create({
      gravity: { x: 0, y: 1 }
    })
    engineRef.current = engine

    // Create renderer
    const render = Render.create({
      element: canvasRef.current,
      engine: engine,
      options: {
        width: width,
        height: height,
        wireframes: false,
        background: '#f8f9fa'
      }
    })
    renderRef.current = render

    // Create ground
    const ground = Bodies.rectangle(width / 2, height - 10, width, 20, {
      isStatic: true,
      render: { fillStyle: '#667eea' }
    })

    // Create walls
    const leftWall = Bodies.rectangle(10, height / 2, 20, height, {
      isStatic: true,
      render: { fillStyle: '#667eea' }
    })
    const rightWall = Bodies.rectangle(width - 10, height / 2, 20, height, {
      isStatic: true,
      render: { fillStyle: '#667eea' }
    })

    // Create pegs (obstacles) - staggered pattern
    const pegs = []
    const pegRows = 11
    const pegCols = 9
    const pegSpacing = width / (pegCols + 1)

    for (let row = 0; row < pegRows; row++) {
      const isEvenRow = row % 2 === 0
      const colsInRow = isEvenRow ? pegCols : pegCols - 1
      const xOffset = isEvenRow ? 0 : pegSpacing / 2

      for (let col = 0; col < colsInRow; col++) {
        const x = xOffset + pegSpacing * (col + 1)
        const y = 60 + row * 38
        pegs.push(Bodies.circle(x, y, 8, {
          isStatic: true,
          render: { fillStyle: '#764ba2' },
          restitution: 0.9,
          friction: 0.001
        }))
      }
    }

    // Create slot dividers
    const dividers = []
    for (let i = 1; i < numSlots; i++) {
      const x = wallThickness + (i * slotWidth)
      dividers.push(Bodies.rectangle(x, height - 60, 4, 100, {
        isStatic: true,
        render: { fillStyle: '#667eea' }
      }))
    }

    // Create slot sensors
    const slots = []
    for (let i = 0; i < numSlots; i++) {
      const x = wallThickness + (i * slotWidth) + (slotWidth / 2)
      const slot = Bodies.rectangle(x, height - 30, slotWidth - 10, 40, {
        isStatic: true,
        isSensor: true,
        render: { fillStyle: '#e3f2fd', opacity: 0.5 },
        slotIndex: i
      })
      slots.push(slot)
    }
    slotsRef.current = slots

    // Add all bodies to world
    World.add(engine.world, [ground, leftWall, rightWall, ...pegs, ...dividers, ...slots])

    // Run engine and renderer
    const runner = Runner.create()
    Runner.run(runner, engine)
    Render.run(render)

    // Setup collision detection
    Matter.Events.on(engine, 'collisionStart', (event) => {
      event.pairs.forEach((pair) => {
        const { bodyA, bodyB } = pair

        // Check if collision involves a ball and a slot
        const ball = bodyA.label === 'ball' ? bodyA : bodyB.label === 'ball' ? bodyB : null
        const slot = bodyA.isSensor ? bodyA : bodyB.isSensor ? bodyB : null

        if (ball && slot && ball.hasLanded === false) {
          ball.hasLanded = true
          const slotIndex = slot.slotIndex
          const isRegularPhase = gamePhaseRef.current === 'regular'
          const slotNumber = isRegularPhase ? slotNumbersRef.current[slotIndex] : pbSlotNumbersRef.current[slotIndex]

          setTimeout(() => {
            if (isRegularPhase) {
              setRegularPicks(prev => {
                const newPicks = [...prev, slotNumber]
                // Only re-enable button if this isn't the last ball
                if (newPicks.length < gameConfig.regularPickTotal) {
                  setIsBallDropping(false)
                  // Re-randomize slot numbers after each pick, excluding already picked numbers
                  const allNumbers = Array.from({ length: gameConfig.regularPickMax }, (_, i) => i + 1)
                  const availableNumbers = allNumbers.filter(num => !newPicks.includes(num))
                  const shuffled = shuffleArray(availableNumbers)
                  setSlotNumbers(shuffled.slice(0, 10))
                  slotNumbersRef.current = shuffled.slice(0, 10)
                }
                // If this is the last ball, keep button disabled until powerball phase
                return newPicks
              })
            } else {
              setPbPick(slotNumber)
              setTimeout(() => setGamePhase('complete'), 500)
            }
          }, 500)
        }
      })
    })
  }

  const dropBall = () => {
    if (!engineRef.current) return

    setIsBallDropping(true)

    const width = 800
    const ballRadius = 15
    const x = width / 2 + (Math.random() - 0.5) * 100

    const ball = Matter.Bodies.circle(x, 50, ballRadius, {
      label: 'ball',
      restitution: 0.6,
      friction: 0.01,
      render: {
        fillStyle: gamePhase === 'regular' ? '#667eea' : '#f5576c'
      },
      hasLanded: false
    })

    ballsRef.current.push(ball)
    Matter.World.add(engineRef.current.world, ball)

    setDroppedBalls(prev => prev + 1)
  }

  const startRegularPhase = () => {
    // Generate random slot numbers for regular picks
    const allNumbers = Array.from({ length: gameConfig.regularPickMax }, (_, i) => i + 1)
    const shuffled = shuffleArray(allNumbers)
    const slots = shuffled.slice(0, 10)
    setSlotNumbers(slots)
    slotNumbersRef.current = slots

    setGamePhase('regular')
    gamePhaseRef.current = 'regular'
    setDroppedBalls(0)
    setIsBallDropping(false)
    initializePhysics(true)
  }

  const startPowerballPhase = () => {
    // Clean up previous physics
    if (renderRef.current) {
      Matter.Render.stop(renderRef.current)
      renderRef.current.canvas.remove()
      renderRef.current = null
    }

    // Generate 10 random powerball numbers
    const pbMin = Math.max(1, gameConfig.pbPickMax - 9)
    const pbMax = gameConfig.pbPickMax
    const pbNumbers = []
    while (pbNumbers.length < Math.min(10, gameConfig.pbPickMax)) {
      const num = Math.floor(Math.random() * (pbMax - pbMin + 1)) + pbMin
      if (!pbNumbers.includes(num)) {
        pbNumbers.push(num)
      }
    }
    setPbSlotNumbers(pbNumbers)
    pbSlotNumbersRef.current = pbNumbers

    setGamePhase('powerball')
    gamePhaseRef.current = 'powerball'
    setDroppedBalls(0)
    setIsBallDropping(false)
    initializePhysics(false)
  }

  useEffect(() => {
    return () => {
      if (engineRef.current) {
        Matter.Engine.clear(engineRef.current)
      }
      if (renderRef.current) {
        Matter.Render.stop(renderRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (gamePhase === 'regular' && regularPicks.length === gameConfig.regularPickTotal) {
      setTimeout(() => {
        if (gameConfig.pbPickTotal > 0) {
          startPowerballPhase()
        } else {
          setIsBallDropping(false)
          setGamePhase('complete')
          // Save to history when complete (no powerball)
          saveToHistory({
            method: 'ballDrop',
            preset: selectedPreset,
            regularNumbers: regularPicks.sort((a, b) => a - b),
            powerballNumbers: []
          })
        }
      }, 1000)
    }
  }, [regularPicks, gamePhase, gameConfig, selectedPreset])

  // Save to history when game completes with powerball
  useEffect(() => {
    if (gamePhase === 'complete' && pbPick && regularPicks.length === gameConfig.regularPickTotal) {
      saveToHistory({
        method: 'ballDrop',
        preset: selectedPreset,
        regularNumbers: regularPicks.sort((a, b) => a - b),
        powerballNumbers: [pbPick]
      })
    }
  }, [gamePhase, pbPick, regularPicks, gameConfig, selectedPreset])

  return (
    <div className="ball-drop">
      <h1>Ball Drop Game</h1>

      <div className="info-box">
        <p>Drop balls and watch them bounce through pegs into numbered slots! Each slot contains a random number from the lottery range.</p>
      </div>

      {(gamePhase === 'regular' || gamePhase === 'powerball' || gamePhase === 'complete') && (
        <div className="final-picks">
          <h2>{gamePhase === 'complete' ? 'Your Selected Numbers:' : 'Picking Numbers...'}</h2>
          <div className="numbers">
            <div className="main-numbers">
              {Array.from({ length: gameConfig.regularPickTotal }).map((_, idx) => {
                const sortedPicks = [...regularPicks].sort((a, b) => a - b)
                const hasNumber = sortedPicks[idx] !== undefined
                return (
                  <span key={idx} className={`number ${hasNumber ? '' : 'empty'}`}>
                    {sortedPicks[idx] || '?'}
                  </span>
                )
              })}
            </div>
            {gameConfig.pbPickTotal > 0 && (
              <div className="pb-numbers">
                <span className="label">Powerball:</span>
                <span className={`number powerball ${pbPick ? '' : 'empty'}`}>
                  {pbPick || '?'}
                </span>
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

      {gamePhase === 'setup' && (
        <div className="game-controls">
          <button onClick={startRegularPhase} className="start-btn">
            Start Game
          </button>
        </div>
      )}

      {(gamePhase === 'regular' || gamePhase === 'powerball') && (
        <div className="game-status">
          <div className="phase-info">
            <h3>{gamePhase === 'regular' ? 'Regular Numbers' : 'Powerball Number'}</h3>
            <p>
              {gamePhase === 'regular'
                ? `Dropped: ${regularPicks.length} / ${gameConfig.regularPickTotal}`
                : `Dropped: ${pbPick ? 1 : 0} / 1`
              }
            </p>
          </div>

          {gamePhase === 'regular' && regularPicks.length < gameConfig.regularPickTotal && (
            <button onClick={dropBall} className="drop-btn" disabled={isBallDropping}>
              Drop Ball
            </button>
          )}

          {gamePhase === 'powerball' && !pbPick && (
            <button onClick={dropBall} className="drop-btn powerball-btn" disabled={isBallDropping}>
              Drop Powerball
            </button>
          )}
        </div>
      )}

      <div className="canvas-container" ref={canvasRef}>
        {(gamePhase === 'regular' || gamePhase === 'powerball') && (
          <div className="slot-labels">
            {(gamePhase === 'regular' ? slotNumbers : pbSlotNumbers).map((num, idx) => {
              const width = 800
              const numSlots = 10
              const wallThickness = 20
              const usableWidth = width - (wallThickness * 2)
              const slotWidth = usableWidth / numSlots
              const left = wallThickness + (idx * slotWidth) + (slotWidth / 2)
              return (
                <div key={`${num}-${idx}`} className="slot-label" style={{ left: `${left}px` }}>
                  {num}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {gamePhase === 'complete' && (
        <div className="game-controls">
          <button onClick={resetGame} className="reset-btn">
            Play Again
          </button>
        </div>
      )}
    </div>
  )
}

export default BallDrop
