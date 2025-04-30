// 常用数学公式库
export const formulas = {
    basic: {
        name: '基础数学',
        formulas: [
            {
                id: 'b1',
                title: '二次方程',
                latex: 'ax^2 + bx + c = 0',
                solution: 'x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}',
                description: '求解二次方程的公式，适用于所有二次方程',
                example: '例：x² + 5x + 6 = 0',
                category: '代数',
                isFavorite: false
            },
            {
                id: 'b2',
                title: '完全平方公式',
                latex: 'a^2 \\pm 2ab + b^2 = (a \\pm b)^2',
                description: '两个数和或差的平方展开式',
                example: '例：(x+3)² = x² + 6x + 9',
                category: '代数',
                isFavorite: false
            }
        ]
    },
    geometry: {
        name: '几何',
        formulas: [
            {
                id: 'g1',
                title: '圆的面积',
                latex: 'S = \\pi r^2',
                description: '圆的面积公式，r为圆的半径',
                example: '例：半径为3的圆面积为9π',
                category: '平面几何',
                isFavorite: false
            },
            {
                id: 'g2',
                title: '三角形面积',
                latex: 'S = \\frac{1}{2}ah = \\frac{1}{2}ab\\sin C',
                description: '三角形的面积公式，a为底边，h为高，C为夹角',
                example: '例：底10，高6的三角形面积为30',
                category: '平面几何',
                isFavorite: false
            }
        ]
    },
    trigonometry: {
        name: '三角函数',
        formulas: [
            {
                id: 't1',
                title: '正弦定理',
                latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
                description: '三角形中边与对应角的正弦比相等',
                example: '例：在三角形中，a/sinA = b/sinB',
                category: '三角函数',
                isFavorite: false
            },
            {
                id: 't2',
                title: '余弦定理',
                latex: 'c^2 = a^2 + b^2 - 2ab\\cos C',
                description: '三角形中一边的平方等于其他两边平方和减去它们与夹角余弦的积的两倍',
                example: '例：已知两边及夹角可求第三边',
                category: '三角函数',
                isFavorite: false
            }
        ]
    },
    calculus: {
        name: '微积分',
        formulas: [
            {
                id: 'c1',
                title: '导数基本公式',
                latex: '\\frac{d}{dx}x^n = nx^{n-1}',
                description: '幂函数的导数公式',
                example: '例：d/dx(x³) = 3x²',
                category: '微分',
                isFavorite: false
            },
            {
                id: 'c2',
                title: '积分基本公式',
                latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
                description: '幂函数的不定积分公式，n≠-1',
                example: '例：∫x²dx = x³/3 + C',
                category: '积分',
                isFavorite: false
            }
        ]
    }
}; 