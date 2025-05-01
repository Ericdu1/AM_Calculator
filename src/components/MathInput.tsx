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
  Grid,
  Tabs,
  Tab,
  ButtonGroup,
  Fade
} from '@mui/material';
import {
  Functions as FunctionsIcon,
  Calculate as CalculateIcon,
  Timeline as TimelineIcon,
  Architecture as ArchitectureIcon
} from '@mui/icons-material';

interface Suggestion {
  label: string;
  detail: string;
  type: string;
  insertText: string;
  category?: string;
}

// 输入建议数据
const suggestionData = {
  '求': [
    { label: '求解方程', detail: '求解一元、二元方程', type: 'solve', insertText: '求解方程 ' },
    { label: '求导数', detail: '计算函数导数', type: 'derivative', insertText: '求导数 ' },
    { label: '求积分', detail: '计算定积分或不定积分', type: 'integral', insertText: '求积分 ' },
    { label: '求极限', detail: '计算函数极限', type: 'limit', insertText: '求极限 ' },
    { label: '求面积', detail: '计算几何图形面积', type: 'area', insertText: '求面积 ' },
    { label: '求体积', detail: '计算立体图形体积', type: 'volume', insertText: '求体积 ' },
    { label: '求最值', detail: '求函数最大值最小值', type: 'extremum', insertText: '求最值 ' },
    { label: '求距离', detail: '计算点线面距离', type: 'distance', insertText: '求距离 ' },
    { label: '求概率', detail: '计算概率统计问题', type: 'probability', insertText: '求概率 ' }
  ],
  '解': [
    { label: '解方程', detail: '解一元方程', type: 'equation', insertText: '解方程 ' },
    { label: '解方程组', detail: '解多元方程组', type: 'equations', insertText: '解方程组 ' },
    { label: '解不等式', detail: '解一元不等式', type: 'inequality', insertText: '解不等式 ' },
    { label: '解三角形', detail: '解三角形问题', type: 'triangle', insertText: '解三角形 ' },
    { label: '解析几何', detail: '解析几何问题', type: 'geometry', insertText: '解析几何 ' },
    { label: '解微分方程', detail: '解常微分方程', type: 'differential', insertText: '解微分方程 ' }
  ],
  '计算': [
    { label: '计算表达式', detail: '计算数学表达式', type: 'expression', insertText: '计算 ' },
    { label: '计算定积分', detail: '计算定积分', type: 'definite-integral', insertText: '计算积分 ' },
    { label: '计算导数', detail: '计算函数导数', type: 'derivative', insertText: '计算导数 ' },
    { label: '计算概率', detail: '计算概率问题', type: 'probability', insertText: '计算概率 ' },
    { label: '计算统计量', detail: '计算统计数据', type: 'statistics', insertText: '计算统计 ' },
    { label: '计算矩阵', detail: '矩阵运算', type: 'matrix', insertText: '计算矩阵 ' }
  ],
  '证明': [
    { label: '证明恒等式', detail: '证明代数恒等式', type: 'identity', insertText: '证明恒等式 ' },
    { label: '证明定理', detail: '证明数学定理', type: 'theorem', insertText: '证明定理 ' },
    { label: '证明不等式', detail: '证明不等式', type: 'inequality', insertText: '证明不等式 ' },
    { label: '证明命题', detail: '证明数学命题', type: 'proposition', insertText: '证明命题 ' },
    { label: '证明充要条件', detail: '证明充分必要条件', type: 'condition', insertText: '证明充要条件 ' }
  ],
  '转换': [
    { label: '转换分数', detail: '分数与小数互转', type: 'fraction', insertText: '转换分数 ' },
    { label: '转换单位', detail: '单位换算', type: 'unit', insertText: '转换单位 ' },
    { label: '转换进制', detail: '进制转换', type: 'base', insertText: '转换进制 ' },
    { label: '转换标准型', detail: '转换标准形式', type: 'standard', insertText: '转换标准型 ' },
    { label: '转换坐标', detail: '坐标系转换', type: 'coordinate', insertText: '转换坐标 ' }
  ],
  '化简': [
    { label: '化简表达式', detail: '化简代数表达式', type: 'simplify', insertText: '化简表达式 ' },
    { label: '化简分式', detail: '化简分式', type: 'fraction', insertText: '化简分式 ' },
    { label: '化简根式', detail: '化简根式', type: 'radical', insertText: '化简根式 ' },
    { label: '化简三角式', detail: '化简三角表达式', type: 'trigonometry', insertText: '化简三角式 ' },
    { label: '化简对数', detail: '化简对数表达式', type: 'logarithm', insertText: '化简对数 ' }
  ],
  '因式': [
    { label: '因式分解', detail: '多项式因式分解', type: 'factorize', insertText: '因式分解 ' },
    { label: '公因式', detail: '提取公因式', type: 'common-factor', insertText: '提取公因式 ' },
    { label: '因式分解三角式', detail: '三角式因式分解', type: 'trig-factor', insertText: '分解三角式 ' }
  ]
};

// 数学符号数据 - 重新组织为4个主要类别
const symbolGroups = [
  {
    name: '基础运算',
    symbols: [
      { symbol: '+', desc: '加' },
      { symbol: '-', desc: '减' },
      { symbol: '×', desc: '乘' },
      { symbol: '÷', desc: '除' },
      { symbol: '=', desc: '等于' },
      { symbol: '≠', desc: '不等于' },
      { symbol: '≈', desc: '约等于' },
      { symbol: '±', desc: '正负号' },
      { symbol: '%', desc: '百分号' },
      { symbol: '‰', desc: '千分号' },
      { symbol: '(', desc: '左括号' },
      { symbol: ')', desc: '右括号' },
      { symbol: '[', desc: '左方括号' },
      { symbol: ']', desc: '右方括号' },
      { symbol: '{', desc: '左花括号' },
      { symbol: '}', desc: '右花括号' },
      { symbol: '<', desc: '小于' },
      { symbol: '>', desc: '大于' },
      { symbol: '≤', desc: '小于等于' },
      { symbol: '≥', desc: '大于等于' }
    ]
  },
  {
    name: '代数运算',
    symbols: [
      { symbol: '²', desc: '平方' },
      { symbol: '³', desc: '立方' },
      { symbol: '√', desc: '平方根' },
      { symbol: '∛', desc: '立方根' },
      { symbol: '∑', desc: '求和' },
      { symbol: '∏', desc: '求积' },
      { symbol: '∫', desc: '积分' },
      { symbol: '∂', desc: '偏导' },
      { symbol: '∇', desc: '梯度' },
      { symbol: '∞', desc: '无穷' },
      { symbol: 'lim', desc: '极限' },
      { symbol: 'log', desc: '对数' },
      { symbol: 'ln', desc: '自然对数' },
      { symbol: 'e', desc: '自然常数' },
      { symbol: 'π', desc: '圆周率' },
      { symbol: 'i', desc: '虚数单位' },
      { symbol: '|x|', desc: '绝对值' },
      { symbol: '⌊x⌋', desc: '向下取整' },
      { symbol: '⌈x⌉', desc: '向上取整' },
      { symbol: 'f′', desc: '导数' },
      { symbol: 'f″', desc: '二阶导' }
    ]
  },
  {
    name: '几何三角',
    symbols: [
      { symbol: '∠', desc: '角' },
      { symbol: '∥', desc: '平行' },
      { symbol: '⊥', desc: '垂直' },
      { symbol: '△', desc: '三角形' },
      { symbol: '⊙', desc: '圆' },
      { symbol: '∽', desc: '相似' },
      { symbol: '≅', desc: '全等' },
      { symbol: 'sin', desc: '正弦' },
      { symbol: 'cos', desc: '余弦' },
      { symbol: 'tan', desc: '正切' },
      { symbol: 'cot', desc: '余切' },
      { symbol: 'sec', desc: '正割' },
      { symbol: 'csc', desc: '余割' },
      { symbol: 'arcsin', desc: '反正弦' },
      { symbol: 'arccos', desc: '反余弦' },
      { symbol: 'arctan', desc: '反正切' },
      { symbol: '°', desc: '度数' },
      { symbol: 'rad', desc: '弧度' },
      { symbol: 'π', desc: '圆周率' }
    ]
  },
  {
    name: '集合逻辑',
    symbols: [
      { symbol: '∅', desc: '空集' },
      { symbol: '∈', desc: '属于' },
      { symbol: '∉', desc: '不属于' },
      { symbol: '⊂', desc: '真子集' },
      { symbol: '⊆', desc: '子集' },
      { symbol: '∪', desc: '并集' },
      { symbol: '∩', desc: '交集' },
      { symbol: '∀', desc: '任意' },
      { symbol: '∃', desc: '存在' },
      { symbol: '∵', desc: '因为' },
      { symbol: '∴', desc: '所以' },
      { symbol: '⇒', desc: '推出' },
      { symbol: '⇔', desc: '等价' },
      { symbol: '¬', desc: '非' },
      { symbol: '∧', desc: '且' },
      { symbol: '∨', desc: '或' },
      { symbol: '⊕', desc: '异或' },
      { symbol: '⊻', desc: '异或' },
      { symbol: '⊼', desc: '与非' },
      { symbol: '⊽', desc: '或非' }
    ]
  }
];

const MathInput: React.FC<{
  onSubmit: (value: string) => void;
}> = ({ onSubmit }) => {
  const [value, setValue] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [symbolTabIndex, setSymbolTabIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSymbolTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSymbolTabIndex(newValue);
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
        input.selectionStart = input.selectionEnd = start + symbol.length;
        input.focus();
      }, 0);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setValue(newValue);

    // 获取最后一个关键词
    const match = newValue.match(/[求|解|计算|证明|转换|化简|因式][^求解计算证明转换化简因式]*$/);
    if (match) {
      const keyword = match[0][0]; // 获取第一个字符作为关键词
      const suggestions = suggestionData[keyword as keyof typeof suggestionData] || [];
      setSuggestions(suggestions);
      setSelectedIndex(-1);
    } else {
      setSuggestions([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (suggestions.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedIndex(prev => (prev + 1) % suggestions.length);
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex];
          setValue(suggestion.insertText);
          setSuggestions([]);
          setSelectedIndex(-1);
        } else {
          onSubmit(value);
          setValue('');
        }
        break;
      case 'Escape':
        setSuggestions([]);
        setSelectedIndex(-1);
        break;
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      setAnchorEl(inputRef.current);
    }
  }, []);

  return (
    <Box sx={{ width: '100%', position: 'relative' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="输入数学表达式 (如: 解方程、求导数、转换标准型等)"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        inputRef={inputRef}
        InputProps={{
          endAdornment: (
            <IconButton onClick={() => onSubmit(value)}>
              <CalculateIcon />
            </IconButton>
          ),
        }}
      />

      {/* 符号输入面板 */}
      <Paper sx={{ mt: 2, p: 2 }}>
        <Tabs
          value={symbolTabIndex}
          onChange={handleSymbolTabChange}
          variant="scrollable"
          scrollButtons="auto"
        >
          {symbolGroups.map((group, index) => (
            <Tab key={index} label={group.name} />
          ))}
        </Tabs>
        <Box sx={{ mt: 2 }}>
          <ButtonGroup variant="outlined" size="small">
            {symbolGroups[symbolTabIndex].symbols.map((item, index) => (
              <Tooltip key={index} title={item.desc}>
                <Button onClick={() => insertSymbol(item.symbol)}>
                  {item.symbol}
                </Button>
              </Tooltip>
            ))}
          </ButtonGroup>
        </Box>
      </Paper>

      {/* 输入建议弹出框 */}
      <Popper
        open={suggestions.length > 0}
        anchorEl={anchorEl}
        placement="bottom-start"
        transition
        style={{ width: anchorEl?.clientWidth, zIndex: 1000 }}
      >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={350}>
            <Paper elevation={3}>
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {suggestions.map((suggestion, index) => (
                  <ListItem
                    key={index}
                    selected={index === selectedIndex}
                    onClick={() => {
                      setValue(suggestion.insertText);
                      setSuggestions([]);
                      setSelectedIndex(-1);
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    sx={{
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemIcon>
                      {suggestion.type === 'solve' ? <CalculateIcon /> :
                        suggestion.type === 'derivative' ? <TimelineIcon /> :
                          <FunctionsIcon />}
                    </ListItemIcon>
                    <ListItemText
                      primary={suggestion.label}
                      secondary={suggestion.detail}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Fade>
        )}
      </Popper>
    </Box>
  );
};

export default MathInput; 