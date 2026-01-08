import React, { useState } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  TextField,
  Stack,
  Button,
} from '@mui/material';
import {
  Refresh,
  AccountBalanceWallet,
  PersonAdd,
  Inventory,
  Cancel,
  LocalShipping,
  FilterAlt,
  Clear,
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
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const { metrics, loading, error, refetch } = useDashboardData(startDate, endDate);

  // Determinar se deve usar dados totais ou filtrados
  const useTotal = !startDate && !endDate;

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
  };

  const handleApplyQuickFilter = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

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

      {/* Filtros de Data */}
      <Card sx={{ mb: 3, bgcolor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.12)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
            <FilterAlt /> Filtrar por Período
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
            <TextField
              label="Data Início"
              type="date"
              value={startDate ? startDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{
                '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' },
              }}
            />
            <TextField
              label="Data Fim"
              type="date"
              value={endDate ? endDate.toISOString().split('T')[0] : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
              InputLabelProps={{ shrink: true }}
              size="small"
              sx={{
                '& .MuiInputBase-root': { bgcolor: 'rgba(255,255,255,0.05)', color: 'white' },
                '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
                '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.23)' },
              }}
            />
            <Button
              variant={!startDate && !endDate ? "contained" : "outlined"}
              onClick={handleClearFilters}
              size="small"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.23)' }}
            >
              TOTAL
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleApplyQuickFilter(7)}
              size="small"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.23)' }}
            >
              Últimos 7 dias
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleApplyQuickFilter(30)}
              size="small"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.23)' }}
            >
              Últimos 30 dias
            </Button>
            <Button
              variant="outlined"
              onClick={() => handleApplyQuickFilter(90)}
              size="small"
              sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.23)' }}
            >
              Últimos 90 dias
            </Button>
            {(startDate || endDate) && (
              <Button
                variant="contained"
                color="error"
                onClick={handleClearFilters}
                size="small"
                startIcon={<Clear />}
              >
                Limpar Filtros
              </Button>
            )}
          </Stack>
          {(startDate || endDate) && (
            <Typography variant="caption" sx={{ mt: 1, display: 'block', color: 'rgba(255,255,255,0.7)' }}>
              {startDate && endDate 
                ? `Exibindo dados de ${startDate.toLocaleDateString('pt-BR')} até ${endDate.toLocaleDateString('pt-BR')}`
                : startDate
                ? `Exibindo dados a partir de ${startDate.toLocaleDateString('pt-BR')}`
                : `Exibindo dados até ${endDate.toLocaleDateString('pt-BR')}`
              }
            </Typography>
          )}
        </CardContent>
      </Card>

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
          <StoreMetrics data={metrics.store} useTotal={useTotal} />
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
          }} useTotal={useTotal} />
        </Grid>

        {/* Métricas de Doações */}
        <Grid item xs={12} lg={6}>
          <DonationMetricsImproved data={metrics.donations} useTotal={useTotal} />
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
          <WithdrawalMetrics data={metrics.withdrawals} useTotal={useTotal} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;