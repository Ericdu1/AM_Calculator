import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Divider,
  Grid,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  Functions as FunctionsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Help as HelpIcon,
  Calculate as CalculateIcon,
  LibraryBooks as LibraryIcon,
} from '@mui/icons-material';
import MathInput from './components/MathInput';
import HelpDialog from './components/HelpDialog';
import FormulaLibrary from './components/FormulaLibrary';

function App() {
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedTool, setSelectedTool] = useState('calculator');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
      background: {
        default: darkMode ? '#303030' : '#f5f5f5',
        paper: darkMode ? '#424242' : '#ffffff',
      },
    },
  });

  const handleMathInputSubmit = async (value: string) => {
    try {
      // 这里将添加与后端的交互逻辑
      const mockResult = {
        result: `计算结果: ${value}`,
        steps: [
          '步骤1: 解析输入',
          '步骤2: 应用公式',
          '步骤3: 得出结果'
        ],
        explanation: '这里是详细的解题过程和原理解释...'
      };

      setResult(mockResult.result);
      setSteps(mockResult.steps);
      setExplanation(mockResult.explanation);
      setHistory(prev => [value, ...prev]);
    } catch (error) {
      console.error('处理失败:', error);
      setResult('处理失败，请重试');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const toggleFavorite = (expression: string) => {
    if (favorites.includes(expression)) {
      setFavorites(favorites.filter(f => f !== expression));
    } else {
      setFavorites([expression, ...favorites]);
    }
  };

  const quickGuide = [
    {
      title: '基本操作',
      content: '输入数学表达式，支持基本运算、代数式、方程组等'
    },
    {
      title: '特殊符号',
      content: '使用^表示指数，sqrt()表示平方根，pi表示π'
    },
    {
      title: '高级功能',
      content: '支持微积分、线性代数、统计概率等高级数学运算'
    },
    {
      title: '格式转换',
      content: '可在不同数学表示法之间转换，支持LaTeX格式'
    }
  ];

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              智能数学计算器
            </Typography>
            <IconButton color="inherit" onClick={() => setHelpOpen(true)}>
              <HelpIcon />
            </IconButton>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* 左侧固定导航栏 */}
        <Paper
          elevation={3}
          sx={{
            width: 240,
            flexShrink: 0,
            borderRight: '1px solid rgba(0, 0, 0, 0.12)',
            height: '100vh',
            position: 'fixed',
            pt: 8,
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <List>
            <ListItem button selected={selectedTool === 'calculator'} onClick={() => setSelectedTool('calculator')}>
              <ListItemIcon>
                <CalculateIcon />
              </ListItemIcon>
              <ListItemText primary="计算器" />
            </ListItem>
            <ListItem button selected={selectedTool === 'library'} onClick={() => setSelectedTool('library')}>
              <ListItemIcon>
                <LibraryIcon />
              </ListItemIcon>
              <ListItemText primary="公式库" />
            </ListItem>
            <ListItem button selected={selectedTool === 'history'} onClick={() => setSelectedTool('history')}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="历史记录" />
            </ListItem>
            <ListItem button selected={selectedTool === 'favorites'} onClick={() => setSelectedTool('favorites')}>
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="收藏夹" />
            </ListItem>
          </List>
        </Paper>

        {/* 主要内容区域 */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: '240px', // 左侧导航栏宽度
            mt: 8,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Grid container spacing={3}>
            {/* 使用指南卡片 */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  使用指南
                </Typography>
                <Grid container spacing={2}>
                  {quickGuide.map((guide, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="subtitle1" color="primary" gutterBottom>
                            {guide.title}
                          </Typography>
                          <Typography variant="body2">
                            {guide.content}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
            </Grid>

            {/* 计算器输入区域 */}
            <Grid item xs={12}>
              <Paper elevation={3} sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  智能数学输入
                </Typography>
                <MathInput onSubmit={handleMathInputSubmit} />
              </Paper>
            </Grid>

            {/* 结果展示区域 */}
            {result && (
              <Grid item xs={12}>
                <Paper elevation={3} sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom color="primary">
                    计算结果
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {result}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom color="primary">
                    解题步骤
                  </Typography>
                  <List>
                    {steps.map((step, index) => (
                      <ListItem key={index}>
                        <ListItemText 
                          primary={step}
                          sx={{
                            '& .MuiTypography-root': {
                              fontFamily: 'math',
                            },
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="h6" gutterBottom color="primary">
                    详细解析
                  </Typography>
                  <Typography variant="body1" sx={{ fontFamily: 'math' }}>
                    {explanation}
                  </Typography>
                </Paper>
              </Grid>
            )}
          </Grid>
        </Box>

        <HelpDialog 
          open={helpOpen} 
          onClose={() => setHelpOpen(false)} 
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 