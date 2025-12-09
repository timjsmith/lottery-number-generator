import express from 'express'
import cors from 'cors'
import { generateLotteryNumbers2 } from './lottery-picker.js'

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

app.post('/api/generate', (req, res) => {
  try {
    const {
      lastWinningNumbers,
      genStrings,
      regularPickTotal,
      regularPickMax,
      pbPickTotal,
      pbPickMax,
      additionalGenTotal
    } = req.body

    if (!lastWinningNumbers || !genStrings || genStrings.length === 0) {
      return res.status(400).json({
        error: 'Missing required fields: lastWinningNumbers and genStrings are required'
      })
    }

    console.log('Generating lottery numbers with params:', {
      lastWinningNumbers,
      genStrings,
      regularPickTotal,
      regularPickMax,
      pbPickTotal,
      pbPickMax,
      additionalGenTotal
    })

    const result = generateLotteryNumbers2(
      lastWinningNumbers,
      genStrings,
      regularPickTotal,
      regularPickMax,
      pbPickTotal,
      pbPickMax,
      additionalGenTotal
    )

    res.json(result)
  } catch (error) {
    console.error('Error generating lottery numbers:', error)
    res.status(500).json({ error: 'Failed to generate lottery numbers' })
  }
})

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Lottery picker server is running' })
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
