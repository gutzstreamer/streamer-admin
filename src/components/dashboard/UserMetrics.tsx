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
  People,
  PersonAdd,
  Storefront,
  ShoppingBag,
} from '@mui/icons-material';
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface UserData {
  totalUsers: number;
  totalStreamers: number;
  newUsers30d: number;
  streamersWithProducts: number;
}

interface UserMetricsProps {
  data: UserData;
}

export const UserMetrics: React.FC<UserMetricsProps> = ({ data }) => {
  const pieData = [
    { name: 'Usuários Comuns', value: data.totalUsers - data.totalStreamers, color: '#36A2EB' },
    { name: 'Streamers', value: data.totalStreamers, color: '#FF6384' },
  ];

  const streamerProductsPercentage = data.totalStreamers > 0 
    ? (data.streamersWithProducts / data.totalStreamers * 100).toFixed(1)
    : '0';

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <People color="primary" />
          <Typography variant="h6">👥 Métricas de Usuários</Typography>
        </Box>

        <Grid container spacing={3}>
          {/* Métricas rápidas */}
          <Grid item xs={12} sm={6}>
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Total de Usuários
              </Typography>
              <Typography variant="h4" color="primary.main">
                {data.totalUsers.toLocaleString()}
              </Typography>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="text.secondary">
                Streamers Ativos
              </Typography>
              <Typography variant="h5" color="secondary.main">
                {data.totalStreamers}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Novos Usuários (30d)
              </Typography>
              <Typography variant="h5" color="success.main">
                {data.newUsers30d}
              </Typography>
            </Box>
          </Grid>

          {/* Gráfico de Pizza - Distribuição de Usuários */}
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="text.secondary" mb={1}>
              Distribuição de Usuários
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
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>



          {/* Detalhes e estatísticas */}
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Estatísticas Detalhadas
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              <Chip 
                icon={<People />}
                label={`Total: ${data.totalUsers} usuários`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                icon={<Storefront />}
                label={`${data.totalStreamers} streamers`}
                color="secondary"
                variant="outlined"
              />
              <Chip 
                icon={<ShoppingBag />}
                label={`${streamerProductsPercentage}% com produtos`}
                color="success"
                variant="outlined"
              />
              <Chip 
                icon={<PersonAdd />}
                label={`+${data.newUsers30d} novos (30d)`}
                color="info"
                variant="outlined"
              />
            </Box>
          </Grid>

          {/* Insights */}
          <Grid item xs={12}>
            <Box bgcolor="grey.50" p={2} borderRadius={1}>
              <Typography variant="subtitle2" gutterBottom>
                📈 Insights
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • {streamerProductsPercentage}% dos streamers já têm produtos cadastrados
                <br />
                • {data.newUsers30d} novos usuários nos últimos 30 dias
                <br />
                • Proporção: {((data.totalStreamers / data.totalUsers) * 100).toFixed(1)}% são streamers
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};