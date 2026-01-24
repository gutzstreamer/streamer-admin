import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
  Stack,
} from '@mui/material';
import {
  Favorite,
  TrendingUp,
  Star,
  AttachMoney,
  Receipt,
  Percent,
} from '@mui/icons-material';

interface DonationData {
  total: {
    totalDonations: number;
    totalAmount: number;
    averageDonation: number;
    highestDonation: number;
    totalFees: number;
    topStreamers: Array<{ name: string; amount: number }>;
  };
  last30Days: {
    totalDonations: number;
    totalAmount: number;
    averageDonation: number;
    highestDonation: number;
    totalFees: number;
    topStreamers: Array<{ name: string; amount: number }>;
  };
}

interface DonationMetricsProps {
  data: DonationData;
  useTotal?: boolean;
}

export const DonationMetricsImproved: React.FC<DonationMetricsProps> = memo(({ data, useTotal = false }) => {
  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const currentData = useTotal ? data.total : data.last30Days;

  return (
    <Card 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Círculo decorativo */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: 200,
          height: 200,
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)',
        }}
      />
      
      <CardContent sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
            <Favorite sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              💝 Métricas de Doações
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Análise de doações por período
            </Typography>
          </Box>
        </Box>

        {/* Cards das métricas principais */}
        <Box mb={4}>
          <Grid container spacing={3}>
            {/* Primeira linha - 3 cards */}
            {/* Total de Doações */}
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(233, 30, 99, 0.3)',
                  borderRadius: 3,
                  border: '1px solid rgba(233, 30, 99, 0.4)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(233, 30, 99, 0.8)', mx: 'auto', mb: 2 }}>
                  <Favorite />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.totalDonations.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Total de Doações
                </Typography>
              </Box>
            </Grid>

            {/* Valor Total Arrecadado */}
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(76, 175, 80, 0.3)',
                  borderRadius: 3,
                  border: '1px solid rgba(76, 175, 80, 0.4)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.8)', mx: 'auto', mb: 2 }}>
                  <AttachMoney />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                  {formatCurrency(currentData.totalAmount)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Valor Total Arrecadado
                </Typography>
              </Box>
            </Grid>

            {/* Média por Doação */}
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(33, 150, 243, 0.3)',
                  borderRadius: 3,
                  border: '1px solid rgba(33, 150, 243, 0.4)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', mx: 'auto', mb: 2 }}>
                  <TrendingUp />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                  {formatCurrency(currentData.averageDonation)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Média por Doação
                </Typography>
              </Box>
            </Grid>
            
            {/* Segunda linha - 3 cards */}
            {/* Maior Doação */}
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(255, 152, 0, 0.3)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 152, 0, 0.4)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.8)', mx: 'auto', mb: 2 }}>
                  <Star />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                  {formatCurrency(currentData.highestDonation)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Maior Doação
                </Typography>
              </Box>
            </Grid>
            
            {/* Total em Taxas */}
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(244, 67, 54, 0.3)',
                  borderRadius: 3,
                  border: '1px solid rgba(244, 67, 54, 0.4)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(244, 67, 54, 0.8)', mx: 'auto', mb: 2 }}>
                  <Receipt />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                  {formatCurrency(currentData.totalFees)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Total em Taxas
                </Typography>
              </Box>
            </Grid>
            
            {/* % de Taxa */}
            <Grid item xs={12} sm={6} md={4}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(156, 39, 176, 0.3)',
                  borderRadius: 3,
                  border: '1px solid rgba(156, 39, 176, 0.4)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(156, 39, 176, 0.8)', mx: 'auto', mb: 2 }}>
                  <Percent />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.totalAmount > 0 
                    ? ((currentData.totalFees / currentData.totalAmount) * 100).toFixed(2)
                    : '0.00'
                  }%
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  % de Taxa
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Top 10 Criadores */}
        {currentData.topStreamers && currentData.topStreamers.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={3} color="white">
              🏆 Top 10 Criadores que Mais Receberam Doações
            </Typography>
            
            {/* Primeiro Lugar - Destaque */}
            {currentData.topStreamers[0] && (
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  bgcolor: 'linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.3) 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 193, 7, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 2
                }}
              >
                <Typography variant="h6" sx={{ color: '#FFD700' }}>
                  🥇
                </Typography>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="white">
                    #{1} {currentData.topStreamers[0].name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {formatCurrency(currentData.topStreamers[0].amount)} arrecadados
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Posições 2-10 em Grid */}
            {currentData.topStreamers.length > 1 && (
              <Grid container spacing={3}>
                {/* Coluna 1: Posições 2, 3, 4 */}
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    {currentData.topStreamers.slice(1, 4).map((streamer, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Chip 
                            label={`#${index + 2}`} 
                            size="small" 
                            sx={{
                              bgcolor: 'rgba(192, 192, 192, 0.8)',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                          <Typography variant="body1" fontWeight="bold" color="white">
                            {streamer.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                          {formatCurrency(streamer.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                {/* Coluna 2: Posições 5, 6, 7 */}
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    {currentData.topStreamers.slice(4, 7).map((streamer, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Chip 
                            label={`#${index + 5}`} 
                            size="small" 
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white'
                            }}
                          />
                          <Typography variant="body1" color="white">
                            {streamer.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                          {formatCurrency(streamer.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>

                {/* Coluna 3: Posições 8, 9, 10 */}
                <Grid item xs={12} md={4}>
                  <Box 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.1)',
                      borderRadius: 2,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}
                  >
                    {currentData.topStreamers.slice(7, 10).map((streamer, index) => (
                      <Box key={index} sx={{ mb: 2, pb: 2, borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Chip 
                            label={`#${index + 8}`} 
                            size="small" 
                            sx={{
                              bgcolor: 'rgba(255,255,255,0.2)',
                              color: 'white'
                            }}
                          />
                          <Typography variant="body1" color="white">
                            {streamer.name}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                          {formatCurrency(streamer.amount)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Grid>
              </Grid>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
});