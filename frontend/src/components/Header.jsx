const Header = ({ darkMode, toggleDarkMode }) => {
  return (
    <header className={`py-4 px-6 shadow-md flex justify-between items-center ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center space-x-2">
        <span className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>数学AI计算器</span>
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          aria-label={darkMode ? '切换到亮色模式' : '切换到暗色模式'}
        >
          {darkMode ? (
            <span className="text-yellow-300">☀️</span>
          ) : (
            <span className="text-gray-700">🌙</span>
          )}
        </button>
        <a 
          href="https://github.com/Ericdu1/Math_AI_Calculator" 
          target="_blank" 
          rel="noopener noreferrer"
          className={`p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 ${darkMode ? 'text-white' : 'text-gray-800'}`}
          aria-label="GitHub 仓库"
        >
          GitHub
        </a>
      </div>
    </header>
  )
}

export default Header 