import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
} from '@mui/material';
import {
  ShoppingCart,
  TrendingUp,
  Assessment,
} from '@mui/icons-material';

interface ProductData {
  totalProducts: number;
  orders30d: number;
  averageTicket: number;
  missingData: {
    conversionRate: string;
    topProducts: string;
    topStreamers: string;
  };
}

interface ProductMetricsProps {
  data: ProductData;
}

export const SimpleProductMetrics: React.FC<ProductMetricsProps> = memo(({ data }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const metrics = [
    { 
      label: 'Total de Produtos', 
      value: data.totalProducts.toString(), 
      icon: <ShoppingCart />, 
      color: 'primary' as const 
    },
    { 
      label: 'Pedidos (30d)', 
      value: data.orders30d.toString(), 
      icon: <TrendingUp />, 
      color: 'success' as const 
    },
    { 
      label: 'Ticket Médio', 
      value: formatCurrency(data.averageTicket), 
      icon: <Assessment />, 
      color: 'info' as const 
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📦 Métricas de Produtos
        </Typography>

        <Grid container spacing={2}>
          {/* Métricas principais */}
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Paper elevation={1} sx={{ p: 2, textAlign: 'center' }}>
                <Box color={`${metric.color}.main`} mb={1}>
                  {metric.icon}
                </Box>
                <Typography variant="h6" color="text.primary">{metric.value}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {metric.label}
                </Typography>
              </Paper>
            </Grid>
          ))}

          {/* Insights */}
          <Grid item xs={12}>
            <Box bgcolor="primary.light" p={2} borderRadius={1} mt={2} sx={{ backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" gutterBottom color="primary.dark">
                📊 Insights de Produtos
              </Typography>
              <Typography variant="body2" color="primary.dark">
                • Ticket médio de {formatCurrency(data.averageTicket)} por pedido
                <br />
                • {data.orders30d} pedidos realizados nos últimos 30 dias
                <br />
                • {data.totalProducts} produtos disponíveis no marketplace
              </Typography>
            </Box>
          </Grid>

          {/* Dados pendentes */}
          <Grid item xs={12}>
            <Box bgcolor="warning.light" p={2} borderRadius={1} mt={1}>
              <Typography variant="subtitle2" gutterBottom color="warning.dark">
                ⚠️ Dados Pendentes de Implementação
              </Typography>
              <Typography variant="body2" color="primary.dark">
                <strong>Taxa de conversão:</strong> {data.missingData.conversionRate}
                <br />
                <strong>Top produtos:</strong> {data.missingData.topProducts}
                <br />
                <strong>Top streamers por vendas:</strong> {data.missingData.topStreamers}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});