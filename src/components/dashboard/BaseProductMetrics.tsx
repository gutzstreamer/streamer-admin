import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
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
  const currentData = data.last30Days;

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <Inventory color="primary" />
          <Typography variant="h6">📦 Produtos Base</Typography>
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