import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import Generator from './components/Generator'
import RandomPicker from './components/RandomPicker'
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
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App
