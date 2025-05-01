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
        onClick={() => onClose()}
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
        <DialogContent dividers>
          <Typography variant="h6" gutterBottom>基本功能</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="数学计算"
                secondary="支持基本的算术运算、函数计算、微积分等数学运算"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="表达式转换"
                secondary="可以将数学表达式在不同形式之间转换，如一般式、点斜式等"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>输入方式</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="直接输入"
                secondary="在输入框中直接输入数学表达式，支持LaTeX语法"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="符号键盘"
                secondary="使用界面上的符号键盘输入特殊数学符号"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="自动补全"
                secondary="输入时会自动显示相关建议，使用上下键选择，回车确认"
              />
            </ListItem>
          </List>

          <Divider sx={{ my: 2 }} />

          <Typography variant="h6" gutterBottom>常用命令</Typography>
          <List>
            <ListItem>
              <ListItemText
                primary="解方程"
                secondary="输入：解方程 x^2+3x-4=0"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="求导数"
                secondary="输入：求导数 sin(x)"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="计算积分"
                secondary="输入：计算积分 ∫x^2 dx"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="转换格式"
                secondary="输入：转换为标准型 x^2+y^2=1"
              />
            </ListItem>
          </List>
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