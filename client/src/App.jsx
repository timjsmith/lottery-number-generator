import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Generator from './components/Generator'
import RandomPicker from './components/RandomPicker'
import BallDrop from './components/BallDrop'
import History from './components/History'
import './App.css'

function Navigation() {
  const location = useLocation()

  return (
    <nav className="navigation">
      <Link
        to="/"
        className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
      >
        Generator
      </Link>
      <Link
        to="/random-picker"
        className={location.pathname === '/random-picker' ? 'nav-link active' : 'nav-link'}
      >
        Random Picker
      </Link>
      <Link
        to="/ball-drop"
        className={location.pathname === '/ball-drop' ? 'nav-link active' : 'nav-link'}
      >
        Ball Drop
      </Link>
      <Link
        to="/history"
        className={location.pathname === '/history' ? 'nav-link active' : 'nav-link'}
      >
        History
      </Link>
    </nav>
  )
}

function App() {
  return (
    <Router>
      <div className="App">
        <div className="container">
          <Navigation />
          <Routes>
            <Route path="/" element={<Generator />} />
            <Route path="/random-picker" element={<RandomPicker />} />
            <Route path="/ball-drop" element={<BallDrop />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
