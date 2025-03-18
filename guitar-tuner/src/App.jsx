import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <h1>MyTuner</h1>
      <div className="App">
        <button className="tuning-button">Start Tuning</button>
      </div>
    </>
  )
}

export default App
