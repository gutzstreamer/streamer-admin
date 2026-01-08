import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Avatar,
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  Store,
  Favorite
} from '@mui/icons-material';

interface WalletMetricsProps {
  data: {
    total: {
      storeBalanceReleased: number;
      storeBalancePending: number;
      donationBalanceReleased: number;
      donationBalancePending: number;
    };
    last30Days: {
      storeBalanceReleased: number;
      storeBalancePending: number;
      donationBalanceReleased: number;
      donationBalancePending: number;
    };
  };
}

export const WalletMetrics: React.FC<WalletMetricsProps> = ({ data }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const currentData = data.total;
  
  // Cálculos totais
  const totalReleased = currentData.storeBalanceReleased + currentData.donationBalanceReleased;
  const totalPending = currentData.storeBalancePending + currentData.donationBalancePending;
  const totalBalance = totalReleased + totalPending;
  
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
        {/* Header Simples */}
        <Box display="flex" alignItems="center" gap={2} mb={4}>
          <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
            <AccountBalanceWallet sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              💳 Métricas da Carteira
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Saldos totais liberados e pendentes
            </Typography>
          </Box>
        </Box>

        {/* Seção Carteiras da Loja */}
        <Box mb={4}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(33, 150, 243, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(33, 150, 243, 0.2)',
              mb: 3
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="white" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Store sx={{ color: '#2196F3' }} />
              🏪 Carteiras da Loja
            </Typography>
            
            <Grid container spacing={3}>
              {/* Loja - Liberado */}
              <Grid item xs={6}>
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
                  <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                    {formatCurrency(currentData.storeBalanceReleased)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                    Saldo Liberado
                  </Typography>
                </Box>
              </Grid>

              {/* Loja - Pendente */}
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(33, 150, 243, 0.2)',
                    borderRadius: 3,
                    border: '1px solid rgba(33, 150, 243, 0.3)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                    {formatCurrency(currentData.storeBalancePending)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                    Saldo Pendente
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Seção Carteiras de Doação */}
        <Box mb={4}>
          <Box 
            sx={{ 
              p: 2, 
              bgcolor: 'rgba(233, 30, 99, 0.1)',
              borderRadius: 2,
              border: '1px solid rgba(233, 30, 99, 0.2)',
              mb: 3
            }}
          >
            <Typography variant="h6" fontWeight="bold" color="white" mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Favorite sx={{ color: '#E91E63' }} />
              💰 Carteiras de Doação
            </Typography>
            
            <Grid container spacing={3}>
              {/* Doação - Liberado */}
              <Grid item xs={6}>
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
                  <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                    {formatCurrency(currentData.donationBalanceReleased)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                    Saldo Liberado
                  </Typography>
                </Box>
              </Grid>

              {/* Doação - Pendente */}
              <Grid item xs={6}>
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: 'rgba(233, 30, 99, 0.2)',
                    borderRadius: 3,
                    border: '1px solid rgba(233, 30, 99, 0.3)',
                    textAlign: 'center',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                    {formatCurrency(currentData.donationBalancePending)}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                    Saldo Pendente
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>

        {/* Resumo Estatístico */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📊 Resumo Estatístico
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {formatCurrency(totalReleased)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                  Total Liberado
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(255, 152, 0, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 152, 0, 0.3)'
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {formatCurrency(totalPending)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                  Total Pendente
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Typography variant="h6" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  {formatCurrency(totalBalance)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8, fontSize: '0.7rem' }}>
                  Saldo Total
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};