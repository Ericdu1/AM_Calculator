import React, { useState, useEffect } from 'react';
import {
  Box,
  Select,
  MenuItem,
  TextField,
  Button,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';

interface ConversionTypes {
  [key: string]: string[];
}

interface ConversionResult {
  original: string;
  target_form: string;
  result: string;
  steps: string[];
}

const MathConverter: React.FC = () => {
  const [expressionType, setExpressionType] = useState<string>('');
  const [targetForm, setTargetForm] = useState<string>('');
  const [expression, setExpression] = useState<string>('');
  const [conversionTypes, setConversionTypes] = useState<ConversionTypes>({});
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetch('/api/conversion-types')
      .then(response => response.json())
      .then(data => setConversionTypes(data.types))
      .catch(err => setError('加载转换类型失败'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expression,
          type: expressionType,
          target_form: targetForm,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data);
      } else {
        setError(data.error || '转换失败');
      }
    } catch (err) {
      setError('请求失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          数学表达式转换
        </Typography>

        <form onSubmit={handleSubmit}>
          <Select
            fullWidth
            value={expressionType}
            onChange={(e) => {
              setExpressionType(e.target.value);
              setTargetForm('');
            }}
            sx={{ mb: 2 }}
            displayEmpty
          >
            <MenuItem value="" disabled>
              选择表达式类型
            </MenuItem>
            {Object.keys(conversionTypes).map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>

          {expressionType && (
            <Select
              fullWidth
              value={targetForm}
              onChange={(e) => setTargetForm(e.target.value)}
              sx={{ mb: 2 }}
              displayEmpty
            >
              <MenuItem value="" disabled>
                选择目标格式
              </MenuItem>
              {conversionTypes[expressionType]?.map((form) => (
                <MenuItem key={form} value={form}>
                  {form}
                </MenuItem>
              ))}
            </Select>
          )}

          <TextField
            fullWidth
            label="输入数学表达式"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            sx={{ mb: 2 }}
            multiline
            rows={2}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={!expressionType || !targetForm || !expression || loading}
          >
            {loading ? <CircularProgress size={24} /> : '转换'}
          </Button>
        </form>

        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}

        {result && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              转换结果
            </Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="body1">{result.result}</Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              转换步骤
            </Typography>
            <List>
              {result.steps.map((step, index) => (
                <ListItem key={index}>
                  <ListItemText primary={`${index + 1}. ${step}`} />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default MathConverter; 