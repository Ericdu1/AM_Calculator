import { render, screen, fireEvent, act } from '@testing-library/react'
import FormulaLibrary from '../components/FormulaLibrary'
import { formulas } from '../data/formulas'

// 模拟localStorage
const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
}
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage })

describe('FormulaLibrary 组件测试', () => {
    beforeEach(() => {
        // 清除所有模拟函数的调用记录
        jest.clearAllMocks()
        // 重置localStorage模拟
        mockLocalStorage.getItem.mockReset()
        mockLocalStorage.setItem.mockReset()
    })

    test('渲染基本公式库', () => {
        render(<FormulaLibrary darkMode={false} showFavoritesOnly={false} />)
        
        // 检查标题是否正确显示
        expect(screen.getByText('常用公式库')).toBeInTheDocument()
        
        // 检查搜索框是否存在
        expect(screen.getByPlaceholderText('搜索公式...')).toBeInTheDocument()
        
        // 检查分类选择器是否存在
        expect(screen.getByRole('combobox')).toBeInTheDocument()
        
        // 检查公式卡片是否渲染
        const formulaTitles = Object.values(formulas)
            .flatMap(section => section.formulas)
            .map(formula => formula.title)
        
        formulaTitles.forEach(title => {
            expect(screen.getByText(title)).toBeInTheDocument()
        })
    })

    test('搜索功能', () => {
        render(<FormulaLibrary darkMode={false} showFavoritesOnly={false} />)
        
        // 输入搜索词
        const searchInput = screen.getByPlaceholderText('搜索公式...')
        fireEvent.change(searchInput, { target: { value: '二次方程' } })
        
        // 检查是否只显示匹配的公式
        expect(screen.getByText('二次方程')).toBeInTheDocument()
        expect(screen.queryByText('圆的面积')).not.toBeInTheDocument()
    })

    test('分类过滤功能', () => {
        render(<FormulaLibrary darkMode={false} showFavoritesOnly={false} />)
        
        // 选择分类
        const categorySelect = screen.getByRole('combobox')
        fireEvent.change(categorySelect, { target: { value: '代数' } })
        
        // 检查是否只显示代数分类的公式
        expect(screen.getByText('二次方程')).toBeInTheDocument()
        expect(screen.getByText('完全平方公式')).toBeInTheDocument()
        expect(screen.queryByText('圆的面积')).not.toBeInTheDocument()
    })

    test('收藏功能', () => {
        // 模拟localStorage中没有收藏数据
        mockLocalStorage.getItem.mockReturnValue(null)
        
        render(<FormulaLibrary darkMode={false} showFavoritesOnly={false} />)
        
        // 获取第一个收藏按钮
        const favoriteButtons = screen.getAllByRole('button', { name: /收藏/i })
        const firstFavoriteButton = favoriteButtons[0]
        
        // 点击收藏按钮
        fireEvent.click(firstFavoriteButton)
        
        // 检查localStorage是否被调用
        expect(mockLocalStorage.setItem).toHaveBeenCalled()
        
        // 检查收藏图标是否改变
        expect(firstFavoriteButton.querySelector('svg')).toHaveAttribute('fill', 'currentColor')
    })

    test('收藏夹模式', () => {
        // 模拟localStorage中有收藏数据
        mockLocalStorage.getItem.mockReturnValue(JSON.stringify(['b1']))
        
        render(<FormulaLibrary darkMode={false} showFavoritesOnly={true} />)
        
        // 检查标题是否正确
        expect(screen.getByText('收藏的公式')).toBeInTheDocument()
        
        // 检查是否只显示收藏的公式
        expect(screen.getByText('二次方程')).toBeInTheDocument()
        expect(screen.queryByText('圆的面积')).not.toBeInTheDocument()
    })

    test('暗色模式', () => {
        render(<FormulaLibrary darkMode={true} showFavoritesOnly={false} />)
        
        // 检查暗色模式下的样式类
        const container = screen.getByTestId('formula-library')
        expect(container).toHaveClass('text-gray-200')
    })

    test('空搜索结果提示', () => {
        render(<FormulaLibrary darkMode={false} showFavoritesOnly={false} />)
        
        // 输入不存在的搜索词
        const searchInput = screen.getByPlaceholderText('搜索公式...')
        fireEvent.change(searchInput, { target: { value: '不存在的公式' } })
        
        // 检查空状态提示
        expect(screen.getByText('没有找到匹配的公式')).toBeInTheDocument()
    })

    test('空收藏夹提示', () => {
        // 模拟localStorage中没有收藏数据
        mockLocalStorage.getItem.mockReturnValue(null)
        
        render(<FormulaLibrary darkMode={false} showFavoritesOnly={true} />)
        
        // 检查空收藏夹提示
        expect(screen.getByText('您还没有收藏任何公式')).toBeInTheDocument()
    })
}) 