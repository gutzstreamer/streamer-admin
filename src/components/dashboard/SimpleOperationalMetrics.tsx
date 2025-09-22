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
  Schedule,
  Build,
  LocalShipping,
  Cancel,
  AccountBalance,
  Warning,
} from '@mui/icons-material';

interface OperationalData {
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  canceledOrders: number;
  pendingWithdrawals: number;
  missingData: {
    supportTickets: string;
  };
}

interface OperationalMetricsProps {
  data: OperationalData;
}

export const SimpleOperationalMetrics: React.FC<OperationalMetricsProps> = memo(({ data }) => {
  const metrics = [
    {
      label: 'Pedidos Pendentes',
      value: data.pendingOrders.toString(),
      icon: <Schedule />,
      color: 'warning' as const,
    },
    {
      label: 'Em Processamento',
      value: data.processingOrders.toString(),
      icon: <Build />,
      color: 'info' as const,
    },
    {
      label: 'Enviados',
      value: data.shippedOrders.toString(),
      icon: <LocalShipping />,
      color: 'success' as const,
    },
    {
      label: 'Cancelados',
      value: data.canceledOrders.toString(),
      icon: <Cancel />,
      color: 'error' as const,
    },
    {
      label: 'Saques Pendentes',
      value: data.pendingWithdrawals.toString(),
      icon: <AccountBalance />,
      color: 'secondary' as const,
    },
  ];

  const totalOrders = data.pendingOrders + data.processingOrders + data.shippedOrders + data.canceledOrders;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          ⚙️ Métricas Operacionais
        </Typography>

        <Grid container spacing={2}>
          {metrics.map((metric, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
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

          {/* Resumo operacional */}
          <Grid item xs={12} md={6}>
            <Box bgcolor="primary.light" p={2} borderRadius={1} mt={2} sx={{ backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" gutterBottom color="primary.dark">
                📊 Resumo Operacional
              </Typography>
              <Typography variant="body2" color="primary.dark">
                • Total de pedidos: {totalOrders}
                <br />
                • Taxa de conclusão: {totalOrders > 0 ? Math.round((data.shippedOrders / totalOrders) * 100) : 0}%
                <br />
                • Taxa de cancelamento: {totalOrders > 0 ? Math.round((data.canceledOrders / totalOrders) * 100) : 0}%
                <br />
                • Saques aguardando aprovação: {data.pendingWithdrawals}
              </Typography>
            </Box>
          </Grid>

          {/* Dados pendentes */}
          <Grid item xs={12} md={6}>
            <Box bgcolor="warning.light" p={2} borderRadius={1} mt={2}>
              <Typography variant="subtitle2" gutterBottom color="warning.dark">
                <Warning fontSize="small" sx={{ mr: 1 }} />
                Dados Pendentes de Implementação
              </Typography>
              <Typography variant="body2" color="primary.dark">
                <strong>Tickets de Suporte:</strong> {data.missingData.supportTickets}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});