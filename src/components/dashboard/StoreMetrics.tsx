import React, { memo, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Button,
  Stack,
  Chip,
} from '@mui/material';
import {
  ShoppingCart,
  LocalShipping,
  AccountBalance,
  CreditCard,
  TrendingUp,
  Payments,
  Pending,
  CheckCircle,
  Build,
  LocalShippingOutlined,
  Done,
  Cancel,
} from '@mui/icons-material';

interface StoreData {
  total: {
    totalRevenue: number;
    shippingRevenue: number;
    pixRevenue: number;
    creditCardRevenue: number;
    averageTicket: number;
    totalOrders: number;
    activeProducts: number;
    commissionsPaid: number;
    productsSold: number;
    ordersPending: number;
    ordersPaid: number;
    ordersFactory: number;
    ordersShipped: number;
    ordersDelivered: number;
    ordersCanceled: number;
    topStreamersSales: Array<{
      streamerId: string;
      streamerName: string;
      totalSales: number;
      totalRevenue: number;
      percentage: number;
    }>;
  };
  last30Days: {
    totalRevenue: number;
    shippingRevenue: number;
    pixRevenue: number;
    creditCardRevenue: number;
    averageTicket: number;
    totalOrders: number;
    activeProducts: number;
    commissionsPaid: number;
    productsSold: number;
    ordersPending: number;
    ordersPaid: number;
    ordersFactory: number;
    ordersShipped: number;
    ordersDelivered: number;
    ordersCanceled: number;
    topStreamersSales: Array<{
      streamerId: string;
      streamerName: string;
      totalSales: number;
      totalRevenue: number;
      percentage: number;
    }>;
  };
}

interface StoreMetricsProps {
  data: StoreData;
}

export const StoreMetrics: React.FC<StoreMetricsProps> = memo(({ data }) => {
  const [period, setPeriod] = useState<'total' | 'last30Days'>('last30Days');

  const formatCurrency = (value: number) => 
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);

  const currentData = data[period];

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
        {/* Header com Toggle */}
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
              <ShoppingCart sx={{ fontSize: 28 }} />
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                🏪 Métricas da Loja
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Análise comercial por período
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
              Últimos 30 Dias
            </Button>
          </Stack>
        </Box>

        {/* Métricas Financeiras - Grid 3x2 */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            💰 Métricas Financeiras
          </Typography>
          
          <Grid container spacing={3}>
            {/* Receita Total */}
            <Grid item xs={6} md={4}>
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
                  <ShoppingCart />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {formatCurrency(currentData.totalRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Receita Total
                </Typography>
              </Box>
            </Grid>

            {/* Receita PIX */}
            <Grid item xs={6} md={4}>
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
                  <AccountBalance />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {formatCurrency(currentData.pixRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Vendas PIX
                </Typography>
              </Box>
            </Grid>

            {/* Receita Cartão */}
            <Grid item xs={6} md={4}>
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
                  <CreditCard />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {formatCurrency(currentData.creditCardRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Vendas Cartão
                </Typography>
              </Box>
            </Grid>

            {/* Receita Frete */}
            <Grid item xs={6} md={4}>
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
                  <LocalShipping />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {formatCurrency(currentData.shippingRevenue)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Receita Frete
                </Typography>
              </Box>
            </Grid>

            {/* Comissões Pagas */}
            <Grid item xs={6} md={4}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(255, 193, 7, 0.3)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 193, 7, 0.4)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255, 193, 7, 0.8)', mx: 'auto', mb: 2 }}>
                  <Payments />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {formatCurrency(currentData.commissionsPaid)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Comissões Pagas
                </Typography>
              </Box>
            </Grid>

            {/* Ticket Médio */}
            <Grid item xs={6} md={4}>
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
                  <TrendingUp />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {formatCurrency(currentData.averageTicket)}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Ticket Médio
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Status dos Pedidos */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📦 Status dos Pedidos
          </Typography>
          
          {/* Total de Pedidos - Card Principal */}
          <Box 
            sx={{ 
              p: 3, 
              mb: 3,
              bgcolor: 'rgba(33, 150, 243, 0.3)',
              borderRadius: 3,
              border: '1px solid rgba(33, 150, 243, 0.4)',
              textAlign: 'center',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', mx: 'auto', mb: 2, width: 56, height: 56 }}>
              <ShoppingCart sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h3" fontWeight="bold" color="white" mb={1}>
              {currentData.totalOrders.toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
              Total de Pedidos
            </Typography>
          </Box>

          {/* Grid com Status dos Pedidos */}
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 152, 0, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.8)', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Pending sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentData.ordersPending.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Pendentes
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.8)', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <CheckCircle sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentData.ordersPaid.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Pagos
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(33, 150, 243, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(33, 150, 243, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Build sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentData.ordersFactory.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Produção
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(156, 39, 176, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(156, 39, 176, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(156, 39, 176, 0.8)', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <LocalShippingOutlined sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentData.ordersShipped.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Enviados
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.8)', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Done sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentData.ordersDelivered.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Entregues
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6} md={2}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(244, 67, 54, 0.8)', mx: 'auto', mb: 1, width: 32, height: 32 }}>
                  <Cancel sx={{ fontSize: 20 }} />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentData.ordersCanceled.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Cancelados
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Métricas Adicionais */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📊 Métricas Operacionais
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={4}>
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
                  {currentData.productsSold.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Produtos Vendidos
                </Typography>
              </Box>
            </Grid>
            
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
                <Typography variant="h5" fontWeight="bold" color="white">
                  {((currentData.productsSold / currentData.totalOrders) || 0).toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Produtos por Pedido
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(156, 39, 176, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(156, 39, 176, 0.3)'
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="white">
                  {((currentData.productsSold / currentData.activeProducts) || 0).toFixed(1)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Média de Itens por Produto
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Top 10 Criadores que Mais Venderam */}
        {currentData.topStreamersSales && currentData.topStreamersSales.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="white">
              🏆 Top 10 Criadores que Mais Venderam
            </Typography>
            
            {/* Primeiro Lugar - Destaque */}
            {currentData.topStreamersSales[0] && (
              <Box 
                sx={{ 
                  p: 2, 
                  mb: 2,
                  bgcolor: 'linear-gradient(135deg, rgba(255, 193, 7, 0.3) 0%, rgba(255, 152, 0, 0.3) 100%)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 193, 7, 0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 2
                }}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="h6" sx={{ color: '#FFD700' }}>
                    🥇
                  </Typography>
                  <Box>
                    <Typography variant="h6" fontWeight="bold" color="white">
                      #{1} {String(currentData.topStreamersSales[0].streamerName || 'Criador Desconhecido')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {Number(currentData.topStreamersSales[0].totalSales || 0)} vendas • {formatCurrency(Number(currentData.topStreamersSales[0].totalRevenue || 0))} em comissões ({Number(currentData.topStreamersSales[0].percentage || 0).toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Posições 2-10 em Grid */}
            {currentData.topStreamersSales.length > 1 && (
              <Grid container spacing={2}>
                {currentData.topStreamersSales.slice(1, 10).map((streamer, index) => (
                  <Grid item xs={12} md={6} lg={4} key={String(streamer.streamerId || index)}>
                    <Box 
                      sx={{ 
                        p: 2, 
                        bgcolor: 'rgba(255,255,255,0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Chip 
                          label={`#${index + 2}`} 
                          size="small" 
                          sx={{
                            bgcolor: index < 2 ? 'rgba(192, 192, 192, 0.8)' : 'rgba(255,255,255,0.2)',
                            color: 'white',
                            fontWeight: index < 2 ? 'bold' : 'normal'
                          }}
                        />
                        <Typography 
                          variant="body1" 
                          sx={{ 
                            fontWeight: index < 2 ? 'bold' : 'normal',
                            color: 'white'
                          }}
                          noWrap
                        >
                          {String(streamer.streamerName || 'Criador Desconhecido')}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        <Chip
                          size="small"
                          label={`${Number(streamer.totalSales || 0)} vendas`}
                          sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', color: 'white' }}
                        />
                        <Chip
                          size="small"
                          label={`${formatCurrency(Number(streamer.totalRevenue || 0))}`}
                          sx={{ bgcolor: 'rgba(76, 175, 80, 0.8)', color: 'white' }}
                        />
                        <Chip
                          size="small"
                          label={`${Number(streamer.percentage || 0).toFixed(1)}%`}
                          sx={{ bgcolor: 'rgba(156, 39, 176, 0.8)', color: 'white' }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        )}

      </CardContent>
    </Card>
  );
});