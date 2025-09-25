import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  AccountBalanceWallet,
  MonetizationOn,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

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

export const FinancialMetrics: React.FC<FinancialMetricsProps> = ({ data }) => {
  const pieData = [
    { name: 'Doações', value: data.totalDonations, color: '#FF6B6B' },
    { name: 'Comissões', value: data.totalCommissions, color: '#4ECDC4' },
  ];

  const barData = [
    {
      category: 'Receita Total',
      value: data.totalRevenue,
    },
    {
      category: 'Disponível',
      value: data.availableBalance,
    },
    {
      category: 'Pendente',
      value: data.pendingWithdrawals,
    },
  ];

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <AttachMoney color="primary" />
          <Typography variant="h6">💰 Métricas Financeiras</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Métricas rápidas */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Receita Total
              </Typography>
              <Typography variant="h4" color="success.main">
                {formatCurrency(data.totalRevenue)}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Saldo Disponível
              </Typography>
              <Typography variant="h5" color="primary.main">
                {formatCurrency(data.availableBalance)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Saques Pendentes
              </Typography>
              <Typography variant="h5" color="warning.main">
                {formatCurrency(data.pendingWithdrawals)}
              </Typography>
            </Box>
          </Grid>

          {/* Gráfico de Pizza - Composição da Receita */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Composição da Receita
            </Typography>
            <Box height={200}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Gráfico de Barras - Resumo Financeiro */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Resumo Financeiro
            </Typography>
            <Box height={200}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis tickFormatter={(value) => 
                    `R$ ${(value / 1000).toFixed(0)}k`
                  } />
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Bar dataKey="value" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Detalhes por tipo */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Detalhes por Fonte
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                icon={<MonetizationOn />}
                label={`Doações: ${formatCurrency(data.totalDonations)}`}
                color="secondary"
                variant="outlined"
              />
              <Chip 
                icon={<TrendingUp />}
                label={`Comissões: ${formatCurrency(data.totalCommissions)}`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<AccountBalanceWallet />}
                label={`Saldo: ${formatCurrency(data.availableBalance)}`}
                color="success"
                variant="outlined"
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};