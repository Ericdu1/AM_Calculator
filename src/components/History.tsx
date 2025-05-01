import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  Paper,
  Divider,
  Button,
  Tooltip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
  isFavorite: boolean;
}

interface HistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onDeleteItem: (index: number) => void;
  onRestoreItem: (expression: string) => void;
  onToggleFavorite: (index: number) => void;
}

const History: React.FC<HistoryProps> = ({
  history,
  onClearHistory,
  onDeleteItem,
  onRestoreItem,
  onToggleFavorite
}) => {
  if (history.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          暂无计算历史记录
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">历史记录</Typography>
        <Button
          startIcon={<DeleteSweepIcon />}
          onClick={onClearHistory}
          color="error"
          size="small"
        >
          清除全部
        </Button>
      </Box>

      <Paper elevation={2}>
        <List>
          {history.map((item, index) => (
            <React.Fragment key={index}>
              <ListItem
                secondaryAction={
                  <Box>
                    <Tooltip title="收藏">
                      <IconButton
                        edge="end"
                        onClick={() => onToggleFavorite(index)}
                        sx={{ mr: 1 }}
                      >
                        {item.isFavorite ? (
                          <StarIcon color="primary" />
                        ) : (
                          <StarBorderIcon />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="重新计算">
                      <IconButton
                        edge="end"
                        onClick={() => onRestoreItem(item.expression)}
                        sx={{ mr: 1 }}
                      >
                        <RestoreIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton
                        edge="end"
                        onClick={() => onDeleteItem(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography variant="body1" component="div">
                      {item.expression}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        结果: {item.result}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {item.timestamp.toLocaleString()}
                      </Typography>
                    </Box>
                  }
                />
              </ListItem>
              {index < history.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>
    </Box>
  );
};

export default History; 