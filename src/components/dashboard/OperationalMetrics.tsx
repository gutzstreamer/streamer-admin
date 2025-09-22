import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Assignment,
  LocalShipping,
  Cancel,
  CheckCircle,
  Warning,
  Support,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';

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

export const OperationalMetrics: React.FC<OperationalMetricsProps> = ({ data }) => {
  const totalOrders = data.pendingOrders + data.processingOrders + data.shippedOrders + data.canceledOrders;
  
  const orderStatusData = [
    { name: 'Pendentes', value: data.pendingOrders, color: '#FF9800' },
    { name: 'Processando', value: data.processingOrders, color: '#2196F3' },
    { name: 'Enviados', value: data.shippedOrders, color: '#4CAF50' },
    { name: 'Cancelados', value: data.canceledOrders, color: '#F44336' },
  ];

  const operationalData = [
    { category: 'Pedidos Pendentes', value: data.pendingOrders, status: 'warning' },
    { category: 'Em Processamento', value: data.processingOrders, status: 'info' },
    { category: 'Enviados', value: data.shippedOrders, status: 'success' },
    { category: 'Cancelados', value: data.canceledOrders, status: 'error' },
    { category: 'Saques Pendentes', value: data.pendingWithdrawals, status: 'warning' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'warning': return '#FF9800';
      case 'info': return '#2196F3';
      case 'success': return '#4CAF50';
      case 'error': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  const shippedPercentage = totalOrders > 0 ? (data.shippedOrders / totalOrders * 100).toFixed(1) : '0';
  const canceledPercentage = totalOrders > 0 ? (data.canceledOrders / totalOrders * 100).toFixed(1) : '0';

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Assignment color="primary" />
          <Typography variant="h6">⚠️ Métricas Operacionais</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Alertas importantes */}
          <Grid item xs={12}>
            <Box display="flex" gap={2} mb={2}>
              {data.pendingOrders > 0 && (
                <Alert severity="warning" sx={{ flex: 1 }}>
                  {data.pendingOrders} pedidos pendentes de processamento
                </Alert>
              )}
              {data.pendingWithdrawals > 0 && (
                <Alert severity="info" sx={{ flex: 1 }}>
                  {data.pendingWithdrawals} saques aguardando aprovação
                </Alert>
              )}
              <Alert severity="info" sx={{ flex: 1 }}>
                📋 Suporte: {data.missingData.supportTickets}
              </Alert>
            </Box>
          </Grid>

          {/* Cards de métricas rápidas */}
          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'warning.light', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <Warning />
                  <Typography variant="h6">Pendentes</Typography>
                </Box>
                <Typography variant="h4">{data.pendingOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'info.light', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <LocalShipping />
                  <Typography variant="h6">Processando</Typography>
                </Box>
                <Typography variant="h4">{data.processingOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'success.light', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckCircle />
                  <Typography variant="h6">Enviados</Typography>
                </Box>
                <Typography variant="h4">{data.shippedOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ bgcolor: 'error.light', color: 'white' }}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1}>
                  <Cancel />
                  <Typography variant="h6">Cancelados</Typography>
                </Box>
                <Typography variant="h4">{data.canceledOrders}</Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Gráfico de Pizza - Status dos Pedidos */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Distribuição dos Status dos Pedidos
            </Typography>
            <Box height={250}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={orderStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {orderStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Gráfico de Barras - Resumo Operacional */}
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Resumo Operacional
            </Typography>
            <Box height={250}>
              <ResponsiveContainer>
                <BarChart data={operationalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8"
                    shape={(props: any) => {
                      const { payload } = props;
                      return <Bar {...props} fill={getStatusColor(payload.status)} />;
                    }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Indicadores de Performance */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Indicadores de Performance
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Taxa de Entrega: {shippedPercentage}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(shippedPercentage)} 
                  color="success"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" gutterBottom>
                  Taxa de Cancelamento: {canceledPercentage}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={parseFloat(canceledPercentage)} 
                  color="error"
                  sx={{ height: 8, borderRadius: 1 }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Estatísticas */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Status Operacional
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                icon={<Assignment />}
                label={`${totalOrders} pedidos totais`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<CheckCircle />}
                label={`${shippedPercentage}% entregues`}
                color="success"
                variant="outlined"
              />
              <Chip 
                icon={<Cancel />}
                label={`${canceledPercentage}% cancelados`}
                color="error"
                variant="outlined"
              />
              <Chip 
                icon={<Support />}
                label="Suporte: não implementado"
                color="warning"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Insights */}
          <Grid item xs={12}>
            <Box bgcolor="grey.50" p={2} borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                🔍 Insights Operacionais
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {data.pendingOrders} pedidos precisam ser processados com urgência
                <br />
                • Taxa de entrega de {shippedPercentage}% indica boa performance logística
                <br />
                • {data.pendingWithdrawals} solicitações de saque aguardando aprovação
                <br />
                • Taxa de cancelamento de {canceledPercentage}% está {parseFloat(canceledPercentage) > 10 ? 'alta' : 'normal'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};