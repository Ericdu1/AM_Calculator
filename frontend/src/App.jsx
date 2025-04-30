import { useState } from 'react'
import 'katex/dist/katex.min.css'
import Calculator from './components/Calculator'
import Header from './components/Header'

function App() {
  const [darkMode, setDarkMode] = useState(true)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      <main className="container mx-auto px-4 py-8">
        <Calculator darkMode={darkMode} />
      </main>
      <footer className={`py-4 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        © 2024 数学AI计算器 | 基于 SymPy 和 NumPy
      </footer>
    </div>
  )
}

export default App 