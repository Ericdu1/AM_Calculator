import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Drawer,
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
  Divider
} from '@mui/material';
import {
  History as HistoryIcon,
  Bookmark as BookmarkIcon,
  Functions as FunctionsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import MathInput from './components/MathInput';
import HelpDialog from './components/HelpDialog';
import FormulaLibrary from './components/FormulaLibrary';

function App() {
  const [result, setResult] = useState<string>('');
  const [steps, setSteps] = useState<string[]>([]);
  const [explanation, setExplanation] = useState<string>('');
  const [helpOpen, setHelpOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3',
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setDrawerOpen(true)}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              智能数学计算器
            </Typography>
            <IconButton color="inherit" onClick={toggleDarkMode}>
              {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
          </Toolbar>
        </AppBar>

        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: 240,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 240,
              boxSizing: 'border-box',
            },
          }}
        >
          <Toolbar />
          <List>
            <ListItem button onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <FunctionsIcon />
              </ListItemIcon>
              <ListItemText primary="公式库" />
            </ListItem>
            <ListItem button onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary="历史记录" />
            </ListItem>
            <ListItem button onClick={() => setDrawerOpen(false)}>
              <ListItemIcon>
                <BookmarkIcon />
              </ListItemIcon>
              <ListItemText primary="收藏夹" />
            </ListItem>
          </List>
        </Drawer>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            mt: 8,
            backgroundColor: theme.palette.background.default,
          }}
        >
          <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                智能数学输入
              </Typography>
              <MathInput onSubmit={handleMathInputSubmit} />
            </Paper>

            {result && (
              <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  计算结果
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {result}
                </Typography>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  解题步骤
                </Typography>
                <List>
                  {steps.map((step, index) => (
                    <ListItem key={index}>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>

                <Divider sx={{ my: 2 }} />

                <Typography variant="h6" gutterBottom>
                  详细解析
                </Typography>
                <Typography variant="body1">
                  {explanation}
                </Typography>
              </Paper>
            )}
          </Container>
        </Box>

        <HelpDialog 
          open={helpOpen} 
          onClose={() => setHelpOpen(!helpOpen)} 
        />
      </Box>
    </ThemeProvider>
  );
}

export default App; 