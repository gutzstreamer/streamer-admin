import React, { memo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { TrendingUp, Star } from '@mui/icons-material';

interface TopProductUsageData {
  total: {
    topProductsUsage: Array<{
      productId: number;
      productName: string;
      usageCount: number;
      percentage: number;
    }>;
  };
  last30Days: {
    topProductsUsage: Array<{
      productId: number;
      productName: string;
      usageCount: number;
      percentage: number;
    }>;
  };
}

interface TopProductsUsageProps {
  data: TopProductUsageData;
}

export const TopProductsUsage: React.FC<TopProductsUsageProps> = memo(({ data }) => {
  const [period, setPeriod] = useState<'total' | 'last30Days'>('last30Days');

  const currentData = data[period];

  const handlePeriodChange = (
    _event: React.MouseEvent<HTMLElement>,
    newPeriod: 'total' | 'last30Days' | null,
  ) => {
    if (newPeriod !== null) {
      setPeriod(newPeriod);
    }
  };

  const getPositionColor = (index: number) => {
    if (index === 0) return 'success'; // 1º lugar
    if (index === 1) return 'warning'; // 2º lugar
    if (index === 2) return 'error';   // 3º lugar
    return 'primary'; // Demais posições
  };

  const getPositionEmoji = (index: number) => {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return `${index + 1}º`;
  };

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <TrendingUp color="primary" />
            <Typography variant="h6">📊 Top 10 Produtos Mais Utilizados</Typography>
          </Box>
          
          <ToggleButtonGroup
            value={period}
            exclusive
            onChange={handlePeriodChange}
            size="small"
          >
            <ToggleButton value="last30Days">
              Últimos 30 dias
            </ToggleButton>
            <ToggleButton value="total">
              Total Geral
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" mb={2}>
            Produtos base mais utilizados para criar produtos streamer
          </Typography>
          
          {currentData.topProductsUsage.length > 0 ? (
            <List dense>
              {currentData.topProductsUsage.slice(0, 10).map((product, index) => (
                <ListItem 
                  key={product.productId}
                  sx={{ 
                    borderRadius: 1, 
                    mb: 1,
                    bgcolor: index < 3 ? `${getPositionColor(index)}.light` : 'grey.50',
                    '&:hover': {
                      bgcolor: index < 3 ? `${getPositionColor(index)}.main` : 'grey.100',
                    }
                  }}
                >
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight="bold">
                            {getPositionEmoji(index)}
                          </Typography>
                          <Typography variant="body1" fontWeight={index < 3 ? 'bold' : 'normal'}>
                            {product.productName}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Chip 
                            label={`${product.usageCount} usos`}
                            color={getPositionColor(index)}
                            variant="outlined"
                            size="small"
                          />
                          <Chip 
                            label={`${product.percentage.toFixed(1)}%`}
                            color={getPositionColor(index)}
                            size="small"
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box textAlign="center" py={4}>
              <Star sx={{ fontSize: 48, color: 'grey.300', mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Nenhum dado de uso de produtos encontrado
              </Typography>
            </Box>
          )}
        </Paper>
      </CardContent>
    </Card>
  );
});