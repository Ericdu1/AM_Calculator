import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  TextField,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment } from '@mui/material';

interface Formula {
  id: string;
  title: string;
  latex: string;
  description: string;
  example: string;
  category: string;
  isFavorite: boolean;
}

interface FormulaCategory {
  name: string;
  formulas: Formula[];
}

// 公式数据
const formulaData: FormulaCategory[] = [
  {
    name: '基础代数',
    formulas: [
      {
        id: 'alg1',
        title: '二次方程',
        latex: 'ax^2 + bx + c = 0',
        description: '标准二次方程形式，求解公式：x = (-b ± √(b² - 4ac)) / (2a)',
        example: '例：x² + 5x + 6 = 0',
        category: '基础代数',
        isFavorite: false
      },
      {
        id: 'alg2',
        title: '完全平方公式',
        latex: '(a ± b)² = a² ± 2ab + b²',
        description: '两个数之和或差的平方展开式',
        example: '例：(x+3)² = x² + 6x + 9',
        category: '基础代数',
        isFavorite: false
      },
      {
        id: 'alg3',
        title: '立方公式',
        latex: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)',
        description: '两个数之和或差的立方展开式',
        example: '例：x³ - 8 = (x-2)(x² + 2x + 4)',
        category: '基础代数',
        isFavorite: false
      },
      {
        id: 'alg4',
        title: '平方差公式',
        latex: 'a² - b² = (a+b)(a-b)',
        description: '两个数的平方差因式分解',
        example: '例：x² - 4 = (x+2)(x-2)',
        category: '基础代数',
        isFavorite: false
      },
      {
        id: 'alg5',
        title: '立方和公式',
        latex: 'a³ + b³ = (a + b)(a² - ab + b²)',
        description: '两个数的立方和因式分解',
        example: '例：x³ + 8 = (x+2)(x² - 2x + 4)',
        category: '基础代数',
        isFavorite: false
      }
    ]
  },
  {
    name: '高等代数',
    formulas: [
      {
        id: 'adv1',
        title: '矩阵乘法',
        latex: 'C_{ij} = \\sum_{k=1}^n A_{ik}B_{kj}',
        description: '矩阵乘法的一般形式',
        example: '例：2×2矩阵相乘',
        category: '高等代数',
        isFavorite: false
      },
      {
        id: 'adv2',
        title: '行列式计算',
        latex: '|A| = \\sum_{j=1}^n a_{1j}A_{1j}',
        description: '行列式按第一行展开',
        example: '例：|A| = a₁₁A₁₁ + a₁₂A₁₂',
        category: '高等代数',
        isFavorite: false
      },
      {
        id: 'adv3',
        title: '特征值方程',
        latex: '|A - λI| = 0',
        description: '求矩阵特征值的特征方程',
        example: '例：A为2×2矩阵时的特征方程',
        category: '高等代数',
        isFavorite: false
      }
    ]
  },
  {
    name: '平面几何',
    formulas: [
      {
        id: 'geo1',
        title: '圆的面积',
        latex: 'A = πr²',
        description: '圆的面积公式，r为半径',
        example: '例：半径为3的圆面积为9π',
        category: '平面几何',
        isFavorite: false
      },
      {
        id: 'geo2',
        title: '三角形面积',
        latex: 'A = \\frac{1}{2}bh = \\frac{1}{2}ab\\sin C',
        description: '三角形的面积公式，b为底边，h为高，C为夹角',
        example: '例：底10，高6的三角形面积为30',
        category: '平面几何',
        isFavorite: false
      },
      {
        id: 'geo3',
        title: '平行四边形面积',
        latex: 'A = bh',
        description: '平行四边形的面积公式，b为底边，h为高',
        example: '例：底8，高5的平行四边形面积为40',
        category: '平面几何',
        isFavorite: false
      },
      {
        id: 'geo4',
        title: '梯形面积',
        latex: 'A = \\frac{(a+b)h}{2}',
        description: '梯形的面积公式，a,b为平行边，h为高',
        example: '例：上底3，下底7，高4的梯形面积为20',
        category: '平面几何',
        isFavorite: false
      }
    ]
  },
  {
    name: '立体几何',
    formulas: [
      {
        id: 'solid1',
        title: '球的体积',
        latex: 'V = \\frac{4}{3}πr³',
        description: '球体积公式，r为半径',
        example: '例：半径为2的球体积为32π/3',
        category: '立体几何',
        isFavorite: false
      },
      {
        id: 'solid2',
        title: '圆柱体积',
        latex: 'V = πr²h',
        description: '圆柱体积公式，r为底面半径，h为高',
        example: '例：底面半径3，高4的圆柱体积为36π',
        category: '立体几何',
        isFavorite: false
      },
      {
        id: 'solid3',
        title: '圆锥体积',
        latex: 'V = \\frac{1}{3}πr²h',
        description: '圆锥体积公式，r为底面半径，h为高',
        example: '例：底面半径3，高6的圆锥体积为18π',
        category: '立体几何',
        isFavorite: false
      }
    ]
  },
  {
    name: '微分学',
    formulas: [
      {
        id: 'diff1',
        title: '基本导数公式',
        latex: '\\frac{d}{dx}x^n = nx^{n-1}',
        description: '幂函数求导公式',
        example: '例：d/dx(x³) = 3x²',
        category: '微分学',
        isFavorite: false
      },
      {
        id: 'diff2',
        title: '链式法则',
        latex: '\\frac{d}{dx}f(g(x)) = f\'(g(x))g\'(x)',
        description: '复合函数求导法则',
        example: '例：d/dx(sin(x²)) = 2x·cos(x²)',
        category: '微分学',
        isFavorite: false
      },
      {
        id: 'diff3',
        title: '乘积法则',
        latex: '\\frac{d}{dx}[f(x)g(x)] = f\'(x)g(x) + f(x)g\'(x)',
        description: '两函数乘积的求导法则',
        example: '例：d/dx(x·sin x) = sin x + x·cos x',
        category: '微分学',
        isFavorite: false
      },
      {
        id: 'diff4',
        title: '商法则',
        latex: '\\frac{d}{dx}\\frac{f(x)}{g(x)} = \\frac{f\'(x)g(x) - f(x)g\'(x)}{[g(x)]^2}',
        description: '两函数商的求导法则',
        example: '例：d/dx(x/sin x)',
        category: '微分学',
        isFavorite: false
      }
    ]
  },
  {
    name: '积分学',
    formulas: [
      {
        id: 'int1',
        title: '基本积分公式',
        latex: '\\int x^n dx = \\frac{x^{n+1}}{n+1} + C',
        description: '幂函数积分公式',
        example: '例：∫x²dx = x³/3 + C',
        category: '积分学',
        isFavorite: false
      },
      {
        id: 'int2',
        title: '定积分基本定理',
        latex: '\\int_a^b f(x)dx = F(b) - F(a)',
        description: '定积分的基本定理',
        example: '例：∫₀¹x²dx = [x³/3]₀¹ = 1/3',
        category: '积分学',
        isFavorite: false
      },
      {
        id: 'int3',
        title: '分部积分',
        latex: '\\int udv = uv - \\int vdu',
        description: '分部积分法则',
        example: '例：∫x·sin x dx',
        category: '积分学',
        isFavorite: false
      }
    ]
  },
  {
    name: '三角函数',
    formulas: [
      {
        id: 'trig1',
        title: '正弦定理',
        latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
        description: '三角形中边与对应角的正弦比值相等',
        example: '例：在△ABC中，a/sin A = b/sin B',
        category: '三角函数',
        isFavorite: false
      },
      {
        id: 'trig2',
        title: '余弦定理',
        latex: 'c² = a² + b² - 2ab\\cos C',
        description: '三角形中任意边的平方等于其他两边平方和减去它们与夹角余弦的积的两倍',
        example: '例：已知两边及夹角可求第三边',
        category: '三角函数',
        isFavorite: false
      },
      {
        id: 'trig3',
        title: '和角公式',
        latex: '\\sin(A+B) = \\sin A\\cos B + \\cos A\\sin B',
        description: '正弦函数的和角公式',
        example: '例：sin(60°+30°) = sin60°cos30° + cos60°sin30°',
        category: '三角函数',
        isFavorite: false
      },
      {
        id: 'trig4',
        title: '倍角公式',
        latex: '\\sin 2A = 2\\sin A\\cos A',
        description: '正弦函数的二倍角公式',
        example: '例：sin(2·30°) = 2sin30°cos30°',
        category: '三角函数',
        isFavorite: false
      }
    ]
  },
  {
    name: '概率统计',
    formulas: [
      {
        id: 'prob1',
        title: '排列数',
        latex: 'P_n^r = \\frac{n!}{(n-r)!}',
        description: 'n个元素中取r个元素的排列数',
        example: '例：P(5,3) = 5!/(5-3)! = 60',
        category: '概率统计',
        isFavorite: false
      },
      {
        id: 'prob2',
        title: '组合数',
        latex: 'C_n^r = \\frac{n!}{r!(n-r)!}',
        description: 'n个元素中取r个元素的组合数',
        example: '例：C(5,3) = 5!/(3!(5-3)!) = 10',
        category: '概率统计',
        isFavorite: false
      },
      {
        id: 'prob3',
        title: '条件概率',
        latex: 'P(A|B) = \\frac{P(AB)}{P(B)}',
        description: '在事件B发生的条件下事件A发生的概率',
        example: '例：已知有病且检测阳性的概率除以检测阳性的概率',
        category: '概率统计',
        isFavorite: false
      }
    ]
  }
];

const FormulaLibrary: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formulas, setFormulas] = useState(formulaData);
  const [expandedCategory, setExpandedCategory] = useState<string | false>(false);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const toggleFavorite = (categoryIndex: number, formulaIndex: number) => {
    const newFormulas = [...formulas];
    newFormulas[categoryIndex].formulas[formulaIndex].isFavorite = 
      !newFormulas[categoryIndex].formulas[formulaIndex].isFavorite;
    setFormulas(newFormulas);
  };

  const handleCategoryExpand = (category: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpandedCategory(isExpanded ? category : false);
  };

  const filteredFormulas = formulas.map(category => ({
    ...category,
    formulas: category.formulas.filter(formula =>
      formula.title.toLowerCase().includes(searchTerm) ||
      formula.description.toLowerCase().includes(searchTerm) ||
      formula.category.toLowerCase().includes(searchTerm)
    )
  })).filter(category => category.formulas.length > 0);

  return (
    <Box sx={{ width: '100%', height: '100%', overflow: 'auto' }}>
      <Paper sx={{ p: 2, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="搜索公式..."
          value={searchTerm}
          onChange={handleSearch}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        {filteredFormulas.map((category, categoryIndex) => (
          <Accordion
            key={category.name}
            expanded={expandedCategory === category.name}
            onChange={handleCategoryExpand(category.name)}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="h6">{category.name}</Typography>
              <Chip 
                label={category.formulas.length} 
                size="small" 
                sx={{ ml: 1 }} 
              />
            </AccordionSummary>
            <AccordionDetails>
              <List>
                {category.formulas.map((formula, formulaIndex) => (
                  <React.Fragment key={formula.id}>
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          onClick={() => toggleFavorite(categoryIndex, formulaIndex)}
                        >
                          {formula.isFavorite ? <StarIcon color="primary" /> : <StarBorderIcon />}
                        </IconButton>
                      }
                    >
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" color="primary">
                            {formula.title}
                          </Typography>
                        }
                        secondary={
                          <>
                            <Typography variant="body2" sx={{ mt: 1 }}>
                              {formula.latex}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                              {formula.description}
                            </Typography>
                            <Typography variant="body2" color="primary" sx={{ mt: 1 }}>
                              {formula.example}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        ))}
      </Paper>
    </Box>
  );
};

export default FormulaLibrary; 