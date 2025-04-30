import { FaSun, FaMoon, FaGithub } from 'react-icons/fa'

const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className={`py-4 px-6 shadow-md flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold text-primary">数学AI计算器</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {darkMode ? <FaSun className="text-yellow-300" /> : <FaMoon className="text-gray-700" />}
        </button>
        <a 
          href="https://github.com/Ericdu1/Math_AI_Calculator" 
          target="_blank" 
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          aria-label="GitHub 仓库"
        >
          <FaGithub className={darkMode ? 'text-white' : 'text-gray-800'} />
        </a>
      </div>
    </header>
  )
}

export default Header 