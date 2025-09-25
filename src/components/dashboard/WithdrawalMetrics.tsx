import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Button,
  Divider,
  Chip,
  LinearProgress,
  Avatar,
  Stack,
} from '@mui/material';
import { 
  MonetizationOn, 
  CheckCircle,
  TrendingDown,
  Receipt,
  Paid,
  Schedule,
  AttachMoney,
} from '@mui/icons-material';

interface WithdrawalMetricsProps {
  data: {
    total: {
      completed: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
      pending: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
    };
    last30Days: {
      completed: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
      pending: {
        totalAmount: number;
        totalFee: number;
        finalAmount: number;
        count: number;
      };
    };
  };
}

export const WithdrawalMetrics: React.FC<WithdrawalMetricsProps> = ({ data }) => {
  const [period, setPeriod] = useState<'total' | 'last30Days'>('total');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const currentData = data[period];
  
  // Calcular percentuais e estatísticas
  const totalSaques = currentData.completed.count + currentData.pending.count;
  const completedPercentage = totalSaques > 0 ? (currentData.completed.count / totalSaques) * 100 : 0;
  const pendingPercentage = totalSaques > 0 ? (currentData.pending.count / totalSaques) * 100 : 0;
  
  const totalValueRequested = currentData.completed.totalAmount + currentData.pending.totalAmount;
  const totalFees = currentData.completed.totalFee + currentData.pending.totalFee;
  const totalFinalValue = currentData.completed.finalAmount + currentData.pending.finalAmount;
  
  const averageWithdrawal = totalSaques > 0 ? totalValueRequested / totalSaques : 0;
  const feePercentage = totalValueRequested > 0 ? (totalFees / totalValueRequested) * 100 : 0;

  return (
    <Card 
      sx={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Pattern */}
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
        {/* Header com Toggle */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
              <MonetizationOn sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                💸 Métricas de Saques
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Análise completa de transações
              </Typography>
            </Box>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant={period === 'total' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setPeriod('total')}
              sx={{ 
                color: period === 'total' ? 'primary.main' : 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                bgcolor: period === 'total' ? 'white' : 'transparent',
                '&:hover': {
                  bgcolor: period === 'total' ? 'grey.100' : 'rgba(255,255,255,0.1)',
                }
              }}
            >
              Total
            </Button>
            <Button
              variant={period === 'last30Days' ? 'contained' : 'outlined'}
              size="small"
              onClick={() => setPeriod('last30Days')}
              sx={{ 
                color: period === 'last30Days' ? 'primary.main' : 'white',
                borderColor: 'rgba(255,255,255,0.3)',
                bgcolor: period === 'last30Days' ? 'white' : 'transparent',
                '&:hover': {
                  bgcolor: period === 'last30Days' ? 'grey.100' : 'rgba(255,255,255,0.1)',
                }
              }}
            >
              30 dias
            </Button>
          </Stack>
        </Box>

        {/* Estatísticas Rápidas */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {totalSaques}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Total Saques
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {formatCurrency(averageWithdrawal)}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Ticket Médio
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {feePercentage.toFixed(1)}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Taxa Média
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold">
                {completedPercentage.toFixed(0)}%
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>
                Concluídos
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Card Saques Completados */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                bgcolor: 'rgba(76, 175, 80, 0.15)',
                border: '1px solid rgba(76, 175, 80, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircle sx={{ color: '#4caf50' }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#4caf50' }}>
                      ✅ Completados
                    </Typography>
                  </Box>
                  <Chip 
                    label={currentData.completed.count}
                    sx={{ 
                      bgcolor: '#4caf50',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                {/* Progress bar */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: '#4caf50' }}>
                      Taxa de Conclusão
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#4caf50' }}>
                      {completedPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={completedPercentage} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(76, 175, 80, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#4caf50',
                      },
                    }}
                  />
                </Box>
                
                <Stack spacing={2}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Receipt sx={{ fontSize: 18, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ color: '#4caf50' }}>
                        Valor Solicitado
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {formatCurrency(currentData.completed.totalAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <TrendingDown sx={{ fontSize: 18, color: '#ff5722' }} />
                      <Typography variant="body2" sx={{ color: '#ff5722' }}>
                        Taxas Cobradas
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {formatCurrency(currentData.completed.totalFee)}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(76, 175, 80, 0.3)' }} />

                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Paid sx={{ fontSize: 18, color: '#4caf50' }} />
                      <Typography variant="body2" sx={{ color: '#4caf50' }}>
                        Valor Final Pago
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="white">
                      {formatCurrency(currentData.completed.finalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Card Saques Pendentes */}
          <Grid item xs={12} md={6}>
            <Card 
              sx={{ 
                bgcolor: 'rgba(255, 152, 0, 0.15)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Schedule sx={{ color: '#ff9800' }} />
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#ff9800' }}>
                      ⏳ Pendentes
                    </Typography>
                  </Box>
                  <Chip 
                    label={currentData.pending.count}
                    sx={{ 
                      bgcolor: '#ff9800',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </Box>
                
                {/* Progress bar */}
                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2" sx={{ color: '#ff9800' }}>
                      Aguardando Processamento
                    </Typography>
                    <Typography variant="body2" fontWeight="bold" sx={{ color: '#ff9800' }}>
                      {pendingPercentage.toFixed(1)}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={pendingPercentage} 
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      bgcolor: 'rgba(255, 152, 0, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: '#ff9800',
                      },
                    }}
                  />
                </Box>
                
                <Stack spacing={2}>
                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <Receipt sx={{ fontSize: 18, color: '#ff9800' }} />
                      <Typography variant="body2" sx={{ color: '#ff9800' }}>
                        Valor Solicitado
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {formatCurrency(currentData.pending.totalAmount)}
                    </Typography>
                  </Box>

                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <TrendingDown sx={{ fontSize: 18, color: '#ff5722' }} />
                      <Typography variant="body2" sx={{ color: '#ff5722' }}>
                        Taxas a Cobrar
                      </Typography>
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      {formatCurrency(currentData.pending.totalFee)}
                    </Typography>
                  </Box>

                  <Divider sx={{ borderColor: 'rgba(255, 152, 0, 0.3)' }} />

                  <Box>
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <AttachMoney sx={{ fontSize: 18, color: '#ff9800' }} />
                      <Typography variant="body2" sx={{ color: '#ff9800' }}>
                        Valor Final a Pagar
                      </Typography>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" color="white">
                      {formatCurrency(currentData.pending.finalAmount)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'rgba(255,255,255,0.2)' }} />

        {/* Resumo Financeiro Detalhado */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={3} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            📊 Resumo Financeiro ({period === 'total' ? 'Total Histórico' : 'Últimos 30 dias'})
          </Typography>
          
          {/* Cards de Resumo */}
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="white">
                  {totalSaques}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Total de Saques
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(33, 150, 243, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(33, 150, 243, 0.3)'
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="white">
                  {formatCurrency(totalValueRequested)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Valor Bruto Total
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(244, 67, 54, 0.3)'
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="white">
                  {formatCurrency(totalFees)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Total em Taxas
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.3)'
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="white">
                  {formatCurrency(totalFinalValue)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Valor Líquido Final
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};