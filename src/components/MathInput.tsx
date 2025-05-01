import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Popper,
  Typography,
  CircularProgress,
  Button,
  IconButton,
  Tooltip,
  Divider,
  Grid
} from '@mui/material';
import {
  Functions as FunctionsIcon,
  Calculate as CalculateIcon,
  Transform as TransformIcon,
  Send as SendIcon,
  Clear as ClearIcon,
  History as HistoryIcon,
  Keyboard as KeyboardIcon
} from '@mui/icons-material';

interface Suggestion {
  label: string;
  detail: string;
  type: string;
  insertText: string;
  documentation?: {
    category: string;
    formula: string;
  };
}

const MathInput: React.FC<{
  onSubmit: (value: string) => void;
}> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // 数学键盘符号
  const mathSymbols = [
    { label: '+', tooltip: '加' },
    { label: '-', tooltip: '减' },
    { label: '×', tooltip: '乘' },
    { label: '÷', tooltip: '除' },
    { label: '^', tooltip: '指数' },
    { label: '√', tooltip: '平方根' },
    { label: 'π', tooltip: '圆周率' },
    { label: '∫', tooltip: '积分' },
    { label: '∑', tooltip: '求和' },
    { label: '∏', tooltip: '连乘' },
    { label: '∂', tooltip: '偏导' },
    { label: '∞', tooltip: '无穷' },
  ];

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!value) {
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        // 这里模拟API调用
        const mockSuggestions: Suggestion[] = [
          {
            label: '解方程',
            detail: '求解一元二次方程',
            type: 'template',
            insertText: '解方程 x^2 + 3x + 2 = 0'
          },
          {
            label: '转换标准型',
            detail: '将方程转换为标准形式',
            type: 'transform',
            insertText: '转换标准型 x^2 + 4'
          },
          {
            label: '转换斜截式',
            detail: '将直线方程转换为斜截式',
            type: 'transform',
            insertText: '转换斜截式 2x + 3y = 6'
          },
          {
            label: '转换参数方程',
            detail: '转换为参数方程形式',
            type: 'transform',
            insertText: '转换参数方程 x^2/4 + y^2/9 = 1'
          }
        ];

        setSuggestions(value.startsWith('转换') ? mockSuggestions.filter(s => s.type === 'transform') : mockSuggestions);
        setSelectedIndex(-1);
      } catch (error) {
        console.error('获取建议失败:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [value]);

  useEffect(() => {
    if (inputRef.current) {
      setAnchorEl(inputRef.current);
    }
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!suggestions.length) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          event.preventDefault();
          handleSuggestionSelect(suggestions[selectedIndex]);
        } else {
          handleSubmit();
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setValue(suggestion.insertText);
    setSuggestions([]);
    setSelectedIndex(-1);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSubmit = () => {
    if (value.trim()) {
      onSubmit(value);
      setValue('');
    }
  };

  const handleClear = () => {
    setValue('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const insertSymbol = (symbol: string) => {
    const input = inputRef.current;
    if (input) {
      const start = input.selectionStart || 0;
      const end = input.selectionEnd || 0;
      const newValue = value.substring(0, start) + symbol + value.substring(end);
      setValue(newValue);
      // 设置光标位置
      setTimeout(() => {
        input.setSelectionRange(start + symbol.length, start + symbol.length);
        input.focus();
      }, 0);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'formula':
        return <FunctionsIcon />;
      case 'template':
        return <CalculateIcon />;
      case 'transform':
        return <TransformIcon />;
      default:
        return <CalculateIcon />;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Paper 
        elevation={3} 
        sx={{ 
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="输入数学表达式（如：解方程、求导数、转换标准型等）"
                inputRef={inputRef}
                multiline
                rows={2}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontFamily: 'math',
                    fontSize: '1.1rem',
                  }
                }}
              />
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Tooltip title="清除">
                  <IconButton onClick={handleClear} size="small">
                    <ClearIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="计算">
                  <IconButton 
                    onClick={handleSubmit}
                    color="primary"
                    size="small"
                  >
                    <SendIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="数学键盘">
                  <IconButton 
                    size="small"
                    onClick={() => setShowKeyboard(!showKeyboard)}
                    color={showKeyboard ? 'primary' : 'default'}
                  >
                    <KeyboardIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="历史记录">
                  <IconButton size="small">
                    <HistoryIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Typography variant="caption" color="text.secondary">
                提示：使用^表示指数，sqrt()表示平方根
              </Typography>
            </Box>
          </Grid>

          {showKeyboard && (
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {mathSymbols.map((symbol, index) => (
                  <Tooltip key={index} title={symbol.tooltip}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => insertSymbol(symbol.label)}
                      sx={{
                        minWidth: '40px',
                        height: '40px',
                        fontFamily: 'math',
                        fontSize: '1.1rem'
                      }}
                    >
                      {symbol.label}
                    </Button>
                  </Tooltip>
                ))}
              </Box>
            </Grid>
          )}
        </Grid>
      </Paper>

      <Popper
        open={suggestions.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        style={{ width: anchorEl?.clientWidth, zIndex: 1300 }}
      >
        <Paper elevation={3} sx={{ mt: 1, maxHeight: 300, overflow: 'auto' }}>
          {loading ? (
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
              <CircularProgress size={24} />
            </Box>
          ) : (
            <List dense>
              {suggestions.map((suggestion, index) => (
                <ListItem
                  key={index}
                  selected={index === selectedIndex}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: 'action.hover' },
                  }}
                >
                  <ListItemIcon>
                    {getIconForType(suggestion.type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={suggestion.label}
                    secondary={suggestion.detail}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Paper>
      </Popper>
    </Box>
  );
};

export default MathInput; 