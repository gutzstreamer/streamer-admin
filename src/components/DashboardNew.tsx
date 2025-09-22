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
  AttachMoney,
  People,
  Favorite,
  Assessment,
  Refresh,
} from '@mui/icons-material';
import { useDashboardData } from '../hooks/useDashboardData';
import { StoreMetrics } from './dashboard/StoreMetrics';
import { DonationMetricsImproved } from './dashboard/DonationMetricsImproved';
import { SimpleUserMetrics as UserMetrics } from './dashboard/SimpleUserMetrics';
import { SimpleOperationalMetrics as OperationalMetrics } from './dashboard/SimpleOperationalMetrics';

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
              color="inherit" 
              sx={{ cursor: 'pointer' }}
              onClick={refetch}
            />
          }
        >
          <Typography variant="h6">Erro ao carregar dados</Typography>
          <Typography variant="body2">{error}</Typography>
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          📊 Dashboard - Streamer Admin
        </Typography>
        <Refresh 
          color="primary" 
          sx={{ cursor: 'pointer' }}
          onClick={refetch}
        />
      </Box>

      {/* Cards de resumo rápido */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Receita da Loja (30d) */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <AttachMoney color="success" />
                <Box ml={2}>
                  <Typography color="textSecondary" gutterBottom>
                    Receita Loja (30d)
                  </Typography>
                  <Typography variant="h6">
                    R$ {metrics.store.last30Days.totalRevenue.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Doações (30d) */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Favorite color="error" />
                <Box ml={2}>
                  <Typography color="textSecondary" gutterBottom>
                    Doações (30d)
                  </Typography>
                  <Typography variant="h6">
                    R$ {metrics.donations.last30Days.totalAmount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Total de Usuários */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <People color="primary" />
                <Box ml={2}>
                  <Typography color="textSecondary" gutterBottom>
                    Total de Usuários
                  </Typography>
                  <Typography variant="h6">
                    {metrics.users.total.totalUsers.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Pedidos (30d) */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Assessment color="info" />
                <Box ml={2}>
                  <Typography color="textSecondary" gutterBottom>
                    Pedidos (30d)
                  </Typography>
                  <Typography variant="h6">
                    {metrics.store.last30Days.totalOrders.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Métricas Detalhadas por Seção */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <StoreMetrics data={metrics.store} />
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <DonationMetricsImproved data={metrics.donations} />
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <UserMetrics data={metrics.users} />
        </Grid>
        
        <Grid item xs={12} lg={6}>
          <OperationalMetrics data={metrics.operational} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;