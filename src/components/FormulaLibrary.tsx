import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Paper,
  Divider,
  Collapse
} from '@mui/material';
import {
  Functions as FunctionsIcon,
  Bookmark as BookmarkIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon
} from '@mui/icons-material';

interface Formula {
  id: string;
  name: string;
  expression: string;
  category: string;
  description: string;
}

interface FormulaCategory {
  name: string;
  formulas: Formula[];
}

const formulaData: FormulaCategory[] = [
  {
    name: '代数',
    formulas: [
      {
        id: 'quad',
        name: '二次方程',
        expression: 'ax² + bx + c = 0',
        category: '代数',
        description: '求解二次方程的标准形式'
      },
      {
        id: 'linear',
        name: '一次函数',
        expression: 'y = kx + b',
        category: '代数',
        description: '一次函数的斜截式'
      }
    ]
  },
  {
    name: '几何',
    formulas: [
      {
        id: 'circle',
        name: '圆的标准方程',
        expression: '(x - a)² + (y - b)² = r²',
        category: '几何',
        description: '圆的标准方程形式'
      },
      {
        id: 'ellipse',
        name: '椭圆标准方程',
        expression: 'x²/a² + y²/b² = 1',
        category: '几何',
        description: '椭圆的标准方程形式'
      }
    ]
  },
  {
    name: '微积分',
    formulas: [
      {
        id: 'derivative',
        name: '导数定义',
        expression: 'f\'(x) = lim(h→0) [f(x+h) - f(x)]/h',
        category: '微积分',
        description: '函数导数的定义'
      },
      {
        id: 'integral',
        name: '定积分',
        expression: '∫[a,b] f(x)dx',
        category: '微积分',
        description: '定积分的表示形式'
      }
    ]
  }
];

const FormulaLibrary: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = React.useState<string | null>(null);

  const handleCategoryClick = (categoryName: string) => {
    setExpandedCategory(expandedCategory === categoryName ? null : categoryName);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        数学公式库
      </Typography>

      {formulaData.map((category) => (
        <Paper key={category.name} sx={{ mb: 2 }}>
          <ListItem button onClick={() => handleCategoryClick(category.name)}>
            <ListItemIcon>
              <FunctionsIcon />
            </ListItemIcon>
            <ListItemText primary={category.name} />
            {expandedCategory === category.name ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItem>

          <Collapse in={expandedCategory === category.name}>
            <List component="div" disablePadding>
              {category.formulas.map((formula) => (
                <Box key={formula.id}>
                  <ListItem sx={{ pl: 4 }}>
                    <ListItemText
                      primary={formula.name}
                      secondary={
                        <>
                          <Typography component="span" variant="body2" color="text.primary">
                            {formula.expression}
                          </Typography>
                          <br />
                          {formula.description}
                        </>
                      }
                    />
                    <IconButton edge="end" aria-label="bookmark">
                      <BookmarkIcon />
                    </IconButton>
                  </ListItem>
                  <Divider variant="inset" component="li" />
                </Box>
              ))}
            </List>
          </Collapse>
        </Paper>
      ))}
    </Box>
  );
};

export default FormulaLibrary; 