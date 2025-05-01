import React, { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Toolbar
} from '@mui/material';
import MathConverter from './components/MathConverter';
import MathInput from './components/MathInput';
import HelpDialog from './components/HelpDialog';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`math-tabpanel-${index}`}
      aria-labelledby={`math-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function App() {
  const [tabValue, setTabValue] = useState(0);
  const [result, setResult] = useState<string>('');
  const [helpOpen, setHelpOpen] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleMathInputSubmit = async (value: string) => {
    try {
      setResult(`处理结果: ${value}`);
    } catch (error) {
      console.error('处理失败:', error);
      setResult('处理失败，请重试');
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            智能数学计算器
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Paper elevation={3}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="math calculator tabs"
            centered
          >
            <Tab label="数学计算" />
            <Tab label="表达式转换" />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                智能数学输入
              </Typography>
              <MathInput onSubmit={handleMathInputSubmit} />
            </Box>

            {result && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="body1">
                  {result}
                </Typography>
              </Paper>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <MathConverter />
          </TabPanel>
        </Paper>
      </Container>

      <HelpDialog 
        open={helpOpen} 
        onClose={() => setHelpOpen(!helpOpen)} 
      />
    </Box>
  );
}

export default App; 