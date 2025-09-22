import React, { memo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
} from '@mui/material';
import { Inventory } from '@mui/icons-material';

interface BaseProductData {
  total: {
    totalBaseProducts: number;
    baseProductsActive: number;
    baseProductsInactive: number;
  };
  last30Days: {
    totalBaseProducts: number;
    baseProductsActive: number;
    baseProductsInactive: number;
  };
}

interface BaseProductMetricsProps {
  data: BaseProductData;
}

export const BaseProductMetrics: React.FC<BaseProductMetricsProps> = memo(({ data }) => {
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

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box display="flex" alignItems="center" gap={1}>
            <Inventory color="primary" />
            <Typography variant="h6">📦 Produtos Base</Typography>
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

        {/* Card Status dos Produtos Base */}
        <Grid container spacing={3}>
          {/* Status dos Produtos Base */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Inventory color="primary" />
                <Typography variant="h6">📋 Status dos Produtos Base</Typography>
              </Box>
              
              {/* Total de Produtos Base - Destaque */}
              <Box 
                textAlign="center" 
                mb={3} 
                p={3} 
                bgcolor="info.main" 
                borderRadius={2}
                sx={{ color: 'white' }}
              >
                <Typography variant="h2" color="white" fontWeight="bold">
                  {currentData.totalBaseProducts.toLocaleString()}
                </Typography>
                <Typography variant="h6" color="white" sx={{ opacity: 0.9 }}>
                  Total de Produtos Base
                </Typography>
              </Box>

              {/* Breakdown por Status */}
              <Grid container spacing={1}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="success.main">
                    <strong>Ativos:</strong> {currentData.baseProductsActive.toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>Inativos:</strong> {currentData.baseProductsInactive.toLocaleString()}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});