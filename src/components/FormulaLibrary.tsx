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
    name: '代数',
    formulas: [
      {
        id: 'alg1',
        title: '二次方程',
        latex: 'ax^2 + bx + c = 0',
        description: '标准二次方程形式，求解公式：x = (-b ± √(b² - 4ac)) / (2a)',
        example: '例：x² + 5x + 6 = 0',
        category: '代数',
        isFavorite: false
      },
      {
        id: 'alg2',
        title: '完全平方公式',
        latex: '(a ± b)² = a² ± 2ab + b²',
        description: '两个数之和或差的平方展开式',
        example: '例：(x+3)² = x² + 6x + 9',
        category: '代数',
        isFavorite: false
      },
      {
        id: 'alg3',
        title: '立方公式',
        latex: 'a³ ± b³ = (a ± b)(a² ∓ ab + b²)',
        description: '两个数之和或差的立方展开式',
        example: '例：x³ - 8 = (x-2)(x² + 2x + 4)',
        category: '代数',
        isFavorite: false
      }
    ]
  },
  {
    name: '几何',
    formulas: [
      {
        id: 'geo1',
        title: '圆的面积',
        latex: 'A = πr²',
        description: '圆的面积公式，r为半径',
        example: '例：半径为3的圆面积为9π',
        category: '几何',
        isFavorite: false
      },
      {
        id: 'geo2',
        title: '三角形面积',
        latex: 'A = \\frac{1}{2}bh = \\frac{1}{2}ab\\sin C',
        description: '三角形的面积公式，b为底边，h为高，C为夹角',
        example: '例：底10，高6的三角形面积为30',
        category: '几何',
        isFavorite: false
      },
      {
        id: 'geo3',
        title: '球的体积',
        latex: 'V = \\frac{4}{3}πr³',
        description: '球体积公式，r为半径',
        example: '例：半径为2的球体积为32π/3',
        category: '几何',
        isFavorite: false
      }
    ]
  },
  {
    name: '微积分',
    formulas: [
      {
        id: 'cal1',
        title: '导数基本公式',
        latex: '\\frac{d}{dx}x^n = nx^{n-1}',
        description: '幂函数求导公式',
        example: '例：d/dx(x³) = 3x²',
        category: '微积分',
        isFavorite: false
      },
      {
        id: 'cal2',
        title: '定积分',
        latex: '\\int_a^b f(x)dx = F(b) - F(a)',
        description: '定积分的基本定理',
        example: '例：∫₀¹x²dx = [x³/3]₀¹ = 1/3',
        category: '微积分',
        isFavorite: false
      },
      {
        id: 'cal3',
        title: '链式法则',
        latex: '\\frac{d}{dx}f(g(x)) = f\'(g(x))g\'(x)',
        description: '复合函数求导法则',
        example: '例：d/dx(sin(x²)) = 2x·cos(x²)',
        category: '微积分',
        isFavorite: false
      }
    ]
  },
  {
    name: '三角函数',
    formulas: [
      {
        id: 'tri1',
        title: '正弦定理',
        latex: '\\frac{a}{\\sin A} = \\frac{b}{\\sin B} = \\frac{c}{\\sin C} = 2R',
        description: '三角形中边与对应角的正弦比值相等',
        example: '例：在△ABC中，a/sin A = b/sin B',
        category: '三角函数',
        isFavorite: false
      },
      {
        id: 'tri2',
        title: '余弦定理',
        latex: 'c² = a² + b² - 2ab\\cos C',
        description: '三角形中任意边的平方等于其他两边平方和减去它们与夹角余弦的积的两倍',
        example: '例：已知两边及夹角可求第三边',
        category: '三角函数',
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