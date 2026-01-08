import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Stack,
  Chip,
} from '@mui/material';
import {
  Inventory,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  VisibilityOff
} from '@mui/icons-material';interface ProductData {
  total: {
    totalProductsCreated: number;
    productsApproved: number;
    productsRejected: number;
    productsPending: number;
    productsInactive: number;
    totalBaseProducts: number;
    baseProductsActive: number;
    baseProductsInactive: number;
    topProductsUsage: Array<{
      productId: number;
      productName: string;
      usageCount: number;
      percentage: number;
    }>;
    topProductsSold: Array<{
      productId: string;
      productName: string;
      saleQuantity: number;
      percentage: number;
    }>;
  };
  last30Days: {
    totalProductsCreated: number;
    productsApproved: number;
    productsRejected: number;
    productsPending: number;
    productsInactive: number;
    totalBaseProducts: number;
    baseProductsActive: number;
    baseProductsInactive: number;
    topProductsUsage: Array<{
      productId: number;
      productName: string;
      usageCount: number;
      percentage: number;
    }>;
    topProductsSold: Array<{
      productId: string;
      productName: string;
      saleQuantity: number;
      percentage: number;
    }>;
  };
}

interface ProductMetricsProps {
  data: ProductData;
  useTotal?: boolean;
}

export const ProductMetrics: React.FC<ProductMetricsProps> = memo(({ data, useTotal = false }) => {
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
            <Inventory sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              📦 Produtos
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Análise de produtos por período
            </Typography>
          </Box>
        </Box>

        {/* Card principal - Total de Produtos */}
        <Box mb={4}>
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
            <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', mx: 'auto', mb: 2, width: 56, height: 56 }}>
              <Inventory sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h3" fontWeight="bold" color="white" mb={1}>
              {currentData.totalProductsCreated.toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500 }}>
              Total de Produtos Criados
            </Typography>
          </Box>
        </Box>

        {/* Cards de Status dos Produtos */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📊 Status dos Produtos Streamer
          </Typography>
          
          <Grid container spacing={3}>
            {/* Produtos Aprovados */}
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 3,
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(76, 175, 80, 0.8)', mx: 'auto', mb: 2 }}>
                  <CheckCircle />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {currentData.productsApproved.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Aprovados
                </Typography>
              </Box>
            </Grid>

            {/* Produtos Rejeitados */}
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  borderRadius: 3,
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(244, 67, 54, 0.8)', mx: 'auto', mb: 2 }}>
                  <Cancel />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {currentData.productsRejected.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Rejeitados
                </Typography>
              </Box>
            </Grid>

            {/* Produtos Pendentes */}
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(255, 152, 0, 0.2)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(255, 152, 0, 0.8)', mx: 'auto', mb: 2 }}>
                  <HourglassEmpty />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {currentData.productsPending.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Pendentes
                </Typography>
              </Box>
            </Grid>

            {/* Produtos Inativos */}
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(158, 158, 158, 0.2)',
                  borderRadius: 3,
                  border: '1px solid rgba(158, 158, 158, 0.3)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(158, 158, 158, 0.8)', mx: 'auto', mb: 2 }}>
                  <VisibilityOff />
                </Avatar>
                <Typography variant="h4" fontWeight="bold" color="white" mb={1}>
                  {currentData.productsInactive.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>
                  Inativos
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Seção Produtos Base */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📋 Produtos Base
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
                  {currentData.totalBaseProducts.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Total Base
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
                  {currentData.baseProductsActive.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Base Ativos
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  p: 2, 
                  bgcolor: 'rgba(158, 158, 158, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(158, 158, 158, 0.3)'
                }}
              >
                <Typography variant="h5" fontWeight="bold" color="white">
                  {currentData.baseProductsInactive.toLocaleString()}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Base Inativos
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Top 10 Produtos */}
        {currentData.topProductsUsage && currentData.topProductsUsage.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={3} color="white">
              📊 Top 10 Produtos Base Mais Utilizados
            </Typography>
            
            {/* Primeiro Lugar - Destaque */}
            {currentData.topProductsUsage[0] && (
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
                      #{1} {currentData.topProductsUsage[0].productName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {currentData.topProductsUsage[0].usageCount} usos ({currentData.topProductsUsage[0].percentage.toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Posições 2-10 em Grid */}
            {currentData.topProductsUsage.length > 1 && (
              <Grid container spacing={2}>
                {currentData.topProductsUsage.slice(1, 10).map((product, index) => (
                  <Grid item xs={12} md={6} lg={4} key={product.productId}>
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
                          {product.productName}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        <Chip
                          size="small"
                          label={`${product.usageCount} usos`}
                          sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', color: 'white' }}
                        />
                        <Chip
                          size="small"
                          label={`${product.percentage.toFixed(1)}%`}
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

        {/* Top 10 Produtos Mais Vendidos */}
        {currentData.topProductsSold && currentData.topProductsSold.length > 0 && (
          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" mb={3} color="white">
              🏆 Top 10 Produtos Mais Vendidos
            </Typography>
            
            {/* Primeiro Lugar - Destaque */}
            {currentData.topProductsSold[0] && (
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
                      #{1} {String(currentData.topProductsSold[0].productName || 'Produto Desconhecido')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {Number(currentData.topProductsSold[0].saleQuantity || 0)} vendas ({Number(currentData.topProductsSold[0].percentage || 0).toFixed(1)}%)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Posições 2-10 em Grid */}
            {currentData.topProductsSold.length > 1 && (
              <Grid container spacing={2}>
                {currentData.topProductsSold.slice(1, 10).map((product, index) => (
                  <Grid item xs={12} md={6} lg={4} key={String(product.productId || index)}>
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
                          {String(product.productName || 'Produto Desconhecido')}
                        </Typography>
                      </Box>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        <Chip
                          size="small"
                          label={`${Number(product.saleQuantity || 0)} vendas`}
                          sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', color: 'white' }}
                        />
                        <Chip
                          size="small"
                          label={`${Number(product.percentage || 0).toFixed(1)}%`}
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