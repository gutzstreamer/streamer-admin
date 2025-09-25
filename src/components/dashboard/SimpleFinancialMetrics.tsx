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
  AttachMoney,
  AccountBalance,
  TrendingUp,
  Savings,
} from '@mui/icons-material';

interface FinancialData {
  totalRevenue: number;
  totalDonations: number;
  totalCommissions: number;
  pendingWithdrawals: number;
  availableBalance: number;
}

interface FinancialMetricsProps {
  data: FinancialData;
}

export const SimpleFinancialMetrics: React.FC<FinancialMetricsProps> = memo(({ data }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const metrics = [
    {
      label: 'Receita Total',
      value: formatCurrency(data.totalRevenue),
      icon: <AttachMoney />,
      color: 'success' as const,
    },
    {
      label: 'Doações',
      value: formatCurrency(data.totalDonations),
      icon: <TrendingUp />,
      color: 'info' as const,
    },
    {
      label: 'Comissões',
      value: formatCurrency(data.totalCommissions),
      icon: <Savings />,
      color: 'primary' as const,
    },
    {
      label: 'Saldo Disponível',
      value: formatCurrency(data.availableBalance),
      icon: <AccountBalance />,
      color: 'secondary' as const,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💰 Métricas Financeiras
        </Typography>

        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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

          {/* Resumo */}
          <Grid item xs={12}>
            <Box bgcolor="primary.light" p={2} borderRadius={1} mt={2} sx={{ backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" gutterBottom color="primary.dark">
                📊 Resumo Financeiro
              </Typography>
              <Typography variant="body2" color="primary.dark">
                • Receita total: {formatCurrency(data.totalRevenue)}
                <br />
                • Saques pendentes: {formatCurrency(data.pendingWithdrawals)}
                <br />
                • Saldo disponível para saque: {formatCurrency(data.availableBalance)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});