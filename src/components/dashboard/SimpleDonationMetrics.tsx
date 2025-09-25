import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Paper,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Favorite,
  TrendingUp,
  Star,
  AttachMoney,
} from '@mui/icons-material';

interface DonationData {
  total30d: number;
  totalAmount30d: number;
  average30d: number;
  highest30d: number;
  topStreamers: Array<{ name: string; amount: number }>;
}

interface DonationMetricsProps {
  data: DonationData;
}

export const SimpleDonationMetrics: React.FC<DonationMetricsProps> = memo(({ data }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const metrics = [
    {
      label: 'Doações (30d)',
      value: data.total30d.toLocaleString(),
      icon: <Favorite />,
      color: 'error' as const,
    },
    {
      label: 'Valor Total (30d)',
      value: formatCurrency(data.totalAmount30d),
      icon: <AttachMoney />,
      color: 'success' as const,
    },
    {
      label: 'Média por Doação',
      value: formatCurrency(data.average30d),
      icon: <TrendingUp />,
      color: 'info' as const,
    },
    {
      label: 'Maior Doação',
      value: formatCurrency(data.highest30d),
      icon: <Star />,
      color: 'warning' as const,
    },
  ];

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          💝 Métricas de Doações
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

          {/* Top Streamers */}
          <Grid item xs={12} md={6}>
            <Box bgcolor="primary.light" p={2} borderRadius={1} mt={2} sx={{ backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" gutterBottom color="primary.dark">
                🏆 Top Streamers por Doações
              </Typography>
              {data.topStreamers.length > 0 ? (
                <List dense>
                  {data.topStreamers.map((streamer, index) => (
                    <ListItem key={index} disablePadding>
                      <ListItemText
                        primary={`${index + 1}. ${streamer.name}`}
                        secondary={formatCurrency(streamer.amount)}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body2" color="primary.dark">
                  Nenhuma doação nos últimos 30 dias
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Insights */}
          <Grid item xs={12} md={6}>
            <Box bgcolor="primary.light" p={2} borderRadius={1} mt={2} sx={{ backgroundColor: '#e3f2fd' }}>
              <Typography variant="subtitle2" gutterBottom color="primary.dark">
                📊 Insights de Doações
              </Typography>
              <Typography variant="body2" color="primary.dark">
                • {data.total30d} doações recebidas nos últimos 30 dias
                <br />
                • Valor total arrecadado: {formatCurrency(data.totalAmount30d)}
                <br />
                • Média por doação: {formatCurrency(data.average30d)}
                <br />
                • Maior doação individual: {formatCurrency(data.highest30d)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
});