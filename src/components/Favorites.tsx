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
  Tooltip,
  Chip
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreIcon from '@mui/icons-material/Restore';
import StarIcon from '@mui/icons-material/Star';

interface FavoriteItem {
  id: string;
  type: 'expression' | 'formula';
  content: string;
  description: string;
  category?: string;
  timestamp: Date;
}

interface FavoritesProps {
  favorites: FavoriteItem[];
  onRemoveFavorite: (id: string) => void;
  onRestoreItem: (content: string) => void;
}

const Favorites: React.FC<FavoritesProps> = ({
  favorites,
  onRemoveFavorite,
  onRestoreItem
}) => {
  if (favorites.length === 0) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="body1" color="text.secondary">
          暂无收藏内容
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          点击星标图标将表达式或公式添加到收藏夹
        </Typography>
      </Box>
    );
  }

  // 按类型分组收藏项
  const groupedFavorites = favorites.reduce((acc, item) => {
    const group = acc[item.type] || [];
    group.push(item);
    acc[item.type] = group;
    return acc;
  }, {} as Record<string, FavoriteItem[]>);

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        我的收藏
      </Typography>

      {Object.entries(groupedFavorites).map(([type, items]) => (
        <Paper key={type} sx={{ mb: 2 }}>
          <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
            <Typography variant="subtitle1">
              {type === 'expression' ? '计算表达式' : '数学公式'}
            </Typography>
          </Box>

          <List>
            {items.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  secondaryAction={
                    <Box>
                      <Tooltip title="重新使用">
                        <IconButton
                          edge="end"
                          onClick={() => onRestoreItem(item.content)}
                          sx={{ mr: 1 }}
                        >
                          <RestoreIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="取消收藏">
                        <IconButton
                          edge="end"
                          onClick={() => onRemoveFavorite(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <StarIcon color="primary" fontSize="small" />
                        <Typography variant="body1">
                          {item.content}
                        </Typography>
                        {item.category && (
                          <Chip
                            label={item.category}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          收藏于 {item.timestamp.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </Paper>
      ))}
    </Box>
  );
};

export default Favorites; 