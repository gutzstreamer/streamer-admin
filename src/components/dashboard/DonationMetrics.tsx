import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  Favorite,
  AttachMoney,
  TrendingUp,
  Star,
} from '@mui/icons-material';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';

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

export const DonationMetrics: React.FC<DonationMetricsProps> = ({ data }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const donationStats = [
    { metric: 'Total (30d)', value: data.total30d },
    { metric: 'Valor Total', value: data.totalAmount30d / 100 }, // Dividir para melhor visualização
    { metric: 'Média', value: data.average30d },
    { metric: 'Maior', value: data.highest30d },
  ];

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <Favorite color="primary" />
          <Typography variant="h6">💸 Métricas de Doações</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Métricas rápidas */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Total de Doações (30d)
              </Typography>
              <Typography variant="h4" color="primary.main">
                {data.total30d}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Valor Total (30d)
              </Typography>
              <Typography variant="h5" color="success.main">
                {formatCurrency(data.totalAmount30d)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Doação Média
              </Typography>
              <Typography variant="h5" color="warning.main">
                {formatCurrency(data.average30d)}
              </Typography>
            </Box>
          </Grid>

          {/* Gráfico de Estatísticas */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Estatísticas de Doações
            </Typography>
            <Box height={200}>
              <ResponsiveContainer>
                <AreaChart data={donationStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip formatter={(value) => 
                    typeof value === 'number' && value > 100 
                      ? formatCurrency(value) 
                      : value
                  } />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#FF6B6B" 
                    fill="#FF6B6B" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Grid>

          {/* Top Streamers por Doações */}
          <Grid item xs={12} md={8}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              🏆 Top Streamers por Doações (30d)
            </Typography>
            <List dense>
              {data.topStreamers.map((streamer, index) => (
                <ListItem key={index} divider>
                  <Box display="flex" alignItems="center" gap={1} width="100%">
                    <Chip
                      label={`#${index + 1}`}
                      size="small"
                      color={index === 0 ? 'primary' : index === 1 ? 'secondary' : 'default'}
                    />
                    <ListItemText
                      primary={streamer.name}
                      secondary={formatCurrency(streamer.amount)}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {((streamer.amount / data.totalAmount30d) * 100).toFixed(1)}%
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Resumo Financeiro */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              💰 Resumo Financeiro
            </Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <Box bgcolor="success.light" p={2} borderRadius={1} color="white">
                <Typography variant="subtitle2">Total Arrecadado</Typography>
                <Typography variant="h6">
                  {formatCurrency(data.totalAmount30d)}
                </Typography>
              </Box>
              
              <Box bgcolor="info.light" p={2} borderRadius={1} color="white">
                <Typography variant="subtitle2">Maior Doação</Typography>
                <Typography variant="h6">
                  {formatCurrency(data.highest30d)}
                </Typography>
              </Box>
              
              <Box bgcolor="warning.light" p={2} borderRadius={1} color="white">
                <Typography variant="subtitle2">Média por Doação</Typography>
                <Typography variant="h6">
                  {formatCurrency(data.average30d)}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Estatísticas */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Estatísticas Gerais
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                icon={<Favorite />}
                label={`${data.total30d} doações`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<AttachMoney />}
                label={`${formatCurrency(data.totalAmount30d)} total`}
                color="success"
                variant="outlined"
              />
              <Chip 
                icon={<TrendingUp />}
                label={`${formatCurrency(data.average30d)} média`}
                color="warning"
                variant="outlined"
              />
              <Chip 
                icon={<Star />}
                label={`${formatCurrency(data.highest30d)} recorde`}
                color="info"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Insights */}
          <Grid item xs={12}>
            <Box bgcolor="grey.50" p={2} borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                💡 Insights de Doações
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Foram realizadas {data.total30d} doações nos últimos 30 dias
                <br />
                • Valor médio por doação: {formatCurrency(data.average30d)}
                <br />
                • Maior doação registrada: {formatCurrency(data.highest30d)}
                <br />
                • Total arrecadado em doações: {formatCurrency(data.totalAmount30d)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};