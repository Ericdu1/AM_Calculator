import { useState, useEffect } from 'react'
import { formulas } from '../data/formulas'
import katex from 'katex'

const FormulaLibrary = ({ darkMode, showFavoritesOnly }) => {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [favorites, setFavorites] = useState(new Set())
    
    // 从localStorage加载收藏状态
    useEffect(() => {
        const savedFavorites = localStorage.getItem('formulaFavorites')
        if (savedFavorites) {
            setFavorites(new Set(JSON.parse(savedFavorites)))
        }
    }, [])

    // 保存收藏状态到localStorage
    useEffect(() => {
        localStorage.setItem('formulaFavorites', JSON.stringify([...favorites]))
    }, [favorites])

    // 切换收藏状态
    const toggleFavorite = (formulaId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev)
            if (newFavorites.has(formulaId)) {
                newFavorites.delete(formulaId)
            } else {
                newFavorites.add(formulaId)
            }
            return newFavorites
        })
    }

    // 渲染LaTeX公式
    const renderLatex = (latex) => {
        try {
            const html = katex.renderToString(latex, {
                throwOnError: false,
                displayMode: true
            });
            return <div dangerouslySetInnerHTML={{ __html: html }} />;
        } catch (error) {
            console.error("LaTeX渲染错误:", error);
            return <div className="text-red-500">LaTeX渲染错误</div>;
        }
    };

    // 过滤公式
    const filteredFormulas = Object.entries(formulas).flatMap(([_, section]) =>
        section.formulas.filter(formula =>
            (!showFavoritesOnly || favorites.has(formula.id)) &&
            (selectedCategory === 'all' || formula.category === selectedCategory) &&
            (searchTerm === '' ||
                formula.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                formula.description.toLowerCase().includes(searchTerm.toLowerCase()))
        )
    );

    // 获取所有唯一的分类
    const categories = ['all', ...new Set(Object.values(formulas).flatMap(section =>
        section.formulas.map(formula => formula.category)
    ))];

    return (
        <div className={`mt-6 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`} data-testid="formula-library">
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">
                    {showFavoritesOnly ? '收藏的公式' : '常用公式库'}
                </h2>
                
                {/* 搜索和分类过滤 */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="搜索公式..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`flex-1 px-4 py-2 rounded-lg ${
                            darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-800 border-gray-300'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        data-testid="search-input"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className={`px-4 py-2 rounded-lg ${
                            darkMode
                                ? 'bg-gray-700 text-white border-gray-600'
                                : 'bg-white text-gray-800 border-gray-300'
                        } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        data-testid="category-select"
                    >
                        {categories.map(category => (
                            <option key={category} value={category}>
                                {category === 'all' ? '所有分类' : category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 公式列表 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="formula-list">
                {filteredFormulas.map((formula) => (
                    <div
                        key={formula.id}
                        className={`p-4 rounded-lg ${
                            darkMode
                                ? 'bg-gray-700 hover:bg-gray-600'
                                : 'bg-white hover:bg-gray-50'
                        } shadow-md transition-all duration-200`}
                        data-testid={`formula-card-${formula.id}`}
                    >
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold mb-2">{formula.title}</h3>
                            <button
                                onClick={() => toggleFavorite(formula.id)}
                                className={`p-2 rounded-full ${
                                    favorites.has(formula.id)
                                        ? 'text-yellow-500'
                                        : darkMode
                                            ? 'text-gray-400 hover:text-yellow-500'
                                            : 'text-gray-400 hover:text-yellow-500'
                                }`}
                                data-testid={`favorite-button-${formula.id}`}
                                aria-label={favorites.has(formula.id) ? '取消收藏' : '收藏'}
                            >
                                {favorites.has(formula.id) ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        <div className={`mb-3 overflow-x-auto py-2 px-4 rounded-lg ${
                            darkMode ? 'bg-gray-800' : 'bg-gray-50'
                        }`}>
                            {renderLatex(formula.latex)}
                            {formula.solution && (
                                <div className="mt-2">
                                    {renderLatex(formula.solution)}
                                </div>
                            )}
                        </div>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formula.description}
                        </p>
                        <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {formula.example}
                        </p>
                        <div className={`mt-2 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            分类：{formula.category}
                        </div>
                    </div>
                ))}
            </div>

            {filteredFormulas.length === 0 && (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} data-testid="empty-state">
                    {showFavoritesOnly ? '您还没有收藏任何公式' : '没有找到匹配的公式'}
                </div>
            )}
        </div>
    );
};

export default FormulaLibrary; 