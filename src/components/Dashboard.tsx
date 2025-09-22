import React from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  Refresh,
  AccountBalanceWallet,
  PersonAdd,
  Inventory,
  Cancel,
  LocalShipping,
} from '@mui/icons-material';
import { useDashboardData } from '../hooks/useDashboardData';
import { StoreMetrics } from './dashboard/StoreMetrics';
import { ProductMetrics } from './dashboard/ProductMetrics';
import { DonationMetricsImproved } from './dashboard/DonationMetricsImproved';
import { SimpleUserMetrics as UserMetrics } from './dashboard/SimpleUserMetrics';
import { StreamerMetrics } from './dashboard/StreamerMetrics';
import { WalletMetrics } from './dashboard/WalletMetrics';
import { WithdrawalMetrics } from './dashboard/WithdrawalMetrics';

const Dashboard: React.FC = () => {
  const { metrics, loading, error, refetch } = useDashboardData();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress size={60} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Carregando métricas do dashboard...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert 
          severity="error" 
          action={
            <Refresh 
              onClick={refetch} 
              sx={{ cursor: 'pointer' }}
            />
          }
        >
          Erro ao carregar dados: {error}
        </Alert>
      </Box>
    );
  }

  if (!metrics) {
    return (
      <Box p={3}>
        <Alert severity="warning">
          Nenhum dado disponível no momento.
        </Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Header */}
      <Box mb={3} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" component="h1" gutterBottom>
          📊 Dashboard - Streamer Admin
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2" color="text.secondary">
            Atualizado agora
          </Typography>
          <Refresh 
            onClick={refetch} 
            sx={{ cursor: 'pointer', color: 'primary.main' }}
          />
        </Box>
      </Box>

      {/* Métricas rápidas */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'error.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <AccountBalanceWallet />
                <Typography variant="h6">Saques Pendentes</Typography>
              </Box>
              <Typography variant="h4">
                {metrics.pendingRequests.withdrawalRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'warning.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <PersonAdd />
                <Typography variant="h6">Streamers Pendentes</Typography>
              </Box>
              <Typography variant="h4">
                {metrics.pendingRequests.streamerRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'info.light', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Inventory />
                <Typography variant="h6">Produtos Pendentes</Typography>
              </Box>
              <Typography variant="h4">
                {metrics.pendingRequests.productStreamerRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'error.dark', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <Cancel />
                <Typography variant="h6">Cancelamentos Pendentes</Typography>
              </Box>
              <Typography variant="h4">
                {metrics.pendingRequests.orderCancelRequests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ bgcolor: 'success.dark', color: 'white' }}>
            <CardContent>
              <Box display="flex" alignItems="center" gap={1}>
                <LocalShipping />
                <Typography variant="h6">Orders (Factory)</Typography>
              </Box>
              <Typography variant="h4">
                {metrics.operational.ordersFactory24h}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Componentes de métricas detalhadas */}
      <Grid container spacing={3}>
        {/* Métricas da Loja */}
        <Grid item xs={12} lg={6}>
          <StoreMetrics data={metrics.store} />
        </Grid>

        {/* Métricas de Produtos */}
        <Grid item xs={12} lg={6}>
          <ProductMetrics data={{
            total: { 
              ...metrics.store.total, 
              ...metrics.baseProducts.total,
              ...metrics.topProductsUsage.total
            },
            last30Days: { 
              ...metrics.store.last30Days, 
              ...metrics.baseProducts.last30Days,
              ...metrics.topProductsUsage.last30Days
            }
          }} />
        </Grid>

        {/* Métricas de Doações */}
        <Grid item xs={12} lg={6}>
          <DonationMetricsImproved data={metrics.donations} />
        </Grid>

        {/* Métricas de Usuários */}
        <Grid item xs={12} lg={6}>
          <UserMetrics data={metrics.users} />
        </Grid>

        {/* Métricas de Criadores */}
        <Grid item xs={12} lg={6}>
          <StreamerMetrics data={metrics.streamers} />
        </Grid>

        {/* Métricas da Carteira */}
        <Grid item xs={12} lg={6}>
          <WalletMetrics data={metrics.wallets} />
        </Grid>

        {/* Métricas de Saques */}
        <Grid item xs={12} lg={6}>
          <WithdrawalMetrics data={metrics.withdrawals} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;