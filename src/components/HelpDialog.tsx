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
  Divider
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
          使用指南
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              基本功能
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="数学计算"
                  secondary="支持基础运算、方程求解、微积分、几何计算等多种数学运算"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="表达式转换"
                  secondary="可以在不同的数学表达式格式之间进行转换，如一般式、标准型、参数方程等"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="智能输入"
                  secondary="提供智能输入建议，支持常用数学符号和表达式的快速输入"
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              使用技巧
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="输入建议"
                  secondary="输入时会自动显示相关的数学表达式建议，使用上下箭头键选择，回车键确认"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="表达式转换"
                  secondary="选择要转换的表达式类型和目标格式，输入原始表达式后点击转换按钮"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="查看步骤"
                  secondary="转换结果会显示详细的转换步骤，帮助理解转换过程"
                />
              </ListItem>
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box>
            <Typography variant="h6" gutterBottom>
              支持的数学功能
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="基础运算"
                  secondary="加减乘除、乘方、开方、对数、三角函数等"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="方程求解"
                  secondary="一元二次方程、多元方程组、不等式等"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="微积分"
                  secondary="导数、积分、极限、级数等"
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="几何"
                  secondary="平面几何、解析几何、向量运算等"
                />
              </ListItem>
            </List>
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>关闭</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelpDialog; 