import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  Paper
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({ open, onClose }) => {
  return (
    <>
      <IconButton
        onClick={onClose}
        sx={{
          position: 'fixed',
          right: 16,
          top: 16,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <HelpOutlineIcon />
      </IconButton>

      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">使用指南</Typography>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>基本功能</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="数学计算"
                  secondary="支持基础运算、代数、微积分、几何等多种数学运算，自动识别输入类型并给出详细解答"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="公式库"
                  secondary="提供常用数学公式查询，包括代数、几何、微积分等领域的重要公式"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="历史记录"
                  secondary="自动保存计算历史，方便回顾和重复使用"
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>输入指南</Typography>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                基本运算
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="加减乘除"
                    secondary="示例：3 + 4 * (2 - 1) / 5"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="指数运算"
                    secondary="示例：2^3 表示2的3次方"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="开方运算"
                    secondary="示例：sqrt(16) 表示开平方根"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                方程求解
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="一元方程"
                    secondary="示例：解方程 2x + 3 = 7"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="二次方程"
                    secondary="示例：解方程 x^2 + 2x + 1 = 0"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="方程组"
                    secondary="示例：解方程组 x + y = 5, 2x - y = 3"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                微积分运算
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="求导数"
                    secondary="示例：求导数 x^2 + 3x"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="定积分"
                    secondary="示例：计算积分 x^2 dx 从0到1"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="不定积分"
                    secondary="示例：计算积分 sin(x) dx"
                  />
                </ListItem>
              </List>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Typography variant="subtitle1" color="primary" gutterBottom>
                几何计算
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="面积计算"
                    secondary="示例：计算圆面积 半径=5"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="体积计算"
                    secondary="示例：计算球体积 半径=3"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="三角函数"
                    secondary="示例：计算 sin(30°) 或 cos(pi/6)"
                  />
                </ListItem>
              </List>
            </Paper>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>特殊功能</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="单位转换"
                  secondary="示例：转换 5千米到米"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="方程式转换"
                  secondary="示例：转换标准型 x^2 + 2x + 1"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="数学证明"
                  secondary="示例：证明 勾股定理"
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" gutterBottom>使用技巧</Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="智能补全"
                  secondary="输入时会自动显示相关的表达式建议，使用上下箭头选择，回车确认"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="历史记录"
                  secondary="点击左侧历史记录图标查看之前的计算，点击任意记录可以重新计算"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="收藏功能"
                  secondary="点击星标图标可以收藏常用的计算表达式，方便下次使用"
                />
              </ListItem>
            </List>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            关闭
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpDialog; 