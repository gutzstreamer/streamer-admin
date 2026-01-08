import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Public,
  VisibilityOff,
  Inventory,
  HourglassEmpty,
  CheckCircle,
  Cancel,
  Group,
} from '@mui/icons-material';

interface StreamerData {
  total: {
    totalStreamers: number;
    streamersPublic: number;
    streamersPrivate: number;
    streamersWithProducts: number;
    requestsPending: number;
    requestsApproved: number;
    requestsRejected: number;
    topCreators: Array<{
      streamerId: string;
      streamerName: string;
      productCount: number;
    }>;
  };
  last30Days: {
    totalStreamers: number;
    streamersPublic: number;
    streamersPrivate: number;
    streamersWithProducts: number;
    requestsPending: number;
    requestsApproved: number;
    requestsRejected: number;
    newStreamers: number;
    topCreators: Array<{
      streamerId: string;
      streamerName: string;
      productCount: number;
    }>;
  };
}

interface StreamerMetricsProps {
  data: StreamerData;
}

export const StreamerMetrics: React.FC<StreamerMetricsProps> = memo(({ data }) => {
  const currentData = data.total;

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
            <Group sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              👥 Métricas de Criadores
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Estatísticas totais dos criadores
            </Typography>
          </Box>
        </Box>

        {/* Cards das métricas principais */}
        <Box mb={4}>
          <Grid container spacing={3}>
            {/* Criadores Públicos */}
            <Grid item xs={6} md={3}>
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
                  <Public />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.streamersPublic.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Criadores Públicos
                </Typography>
              </Box>
            </Grid>

            {/* Criadores Privados */}
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
                  <VisibilityOff />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.streamersPrivate.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Criadores Privados
                </Typography>
              </Box>
            </Grid>

            {/* Com Produtos */}
            <Grid item xs={6} md={3}>
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
                <Avatar sx={{ bgcolor: 'rgba(33, 150, 243, 0.8)', mx: 'auto', mb: 2 }}>
                  <Inventory />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.streamersWithProducts.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Com Produtos
                </Typography>
              </Box>
            </Grid>

            {/* Total Criadores */}
            <Grid item xs={6} md={3}>
              <Box 
                sx={{ 
                  p: 3, 
                  bgcolor: 'rgba(156, 39, 176, 0.2)',
                  borderRadius: 3,
                  border: '1px solid rgba(156, 39, 176, 0.3)',
                  textAlign: 'center',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Avatar sx={{ bgcolor: 'rgba(156, 39, 176, 0.8)', mx: 'auto', mb: 2 }}>
                  <Group />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.totalStreamers.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Total de Criadores
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Seção de Solicitações */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📋 Status de Solicitações
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(255, 152, 0, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(255, 152, 0, 0.3)',
                  textAlign: 'center'
                }}
              >
                <HourglassEmpty sx={{ color: '#FFA726', mb: 1, fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                  {currentData.requestsPending.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                  Pendentes
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(76, 175, 80, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(76, 175, 80, 0.3)',
                  textAlign: 'center'
                }}
              >
                <CheckCircle sx={{ color: '#66BB6A', mb: 1, fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                  {currentData.requestsApproved.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                  Aprovadas
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={4}>
              <Box 
                sx={{ 
                  p: 2, 
                  bgcolor: 'rgba(244, 67, 54, 0.2)',
                  borderRadius: 2,
                  border: '1px solid rgba(244, 67, 54, 0.3)',
                  textAlign: 'center'
                }}
              >
                <Cancel sx={{ color: '#EF5350', mb: 1, fontSize: 32 }} />
                <Typography variant="h5" fontWeight="bold" color="white" sx={{ fontSize: { xs: '1.1rem', sm: '1.3rem', md: '1.5rem' }, wordBreak: 'break-word' }}>
                  {currentData.requestsRejected.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.75rem' }}>
                  Rejeitadas
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Top 10 Criadores */}
        {currentData.topCreators && currentData.topCreators.length > 0 && (
          <Box>
            <Typography variant="h6" fontWeight="bold" mb={3} color="white">
              🏆 Top 10 Criadores com Mais Produtos Ativos
            </Typography>
            
            {/* Primeiro Lugar - Destaque */}
            {currentData.topCreators[0] && (
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
                  👑
                </Typography>
                <Box>
                  <Typography variant="h6" fontWeight="bold" color="white">
                    #{1} {currentData.topCreators[0].streamerName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {currentData.topCreators[0].productCount} produto{currentData.topCreators[0].productCount > 1 ? 's' : ''} ativo{currentData.topCreators[0].productCount > 1 ? 's' : ''}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Posições 2-10 em Grid */}
            {currentData.topCreators.length > 1 && (
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
                    {currentData.topCreators.slice(1, 4).map((creator, index) => (
                      <Box key={creator.streamerId} sx={{ mb: 2, pb: 2, borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
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
                            {creator.streamerName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                          {creator.productCount} produto{creator.productCount > 1 ? 's' : ''} ativo{creator.productCount > 1 ? 's' : ''}
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
                    {currentData.topCreators.slice(4, 7).map((creator, index) => (
                      <Box key={creator.streamerId} sx={{ mb: 2, pb: 2, borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
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
                            {creator.streamerName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                          {creator.productCount} produto{creator.productCount > 1 ? 's' : ''} ativo{creator.productCount > 1 ? 's' : ''}
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
                    {currentData.topCreators.slice(7, 10).map((creator, index) => (
                      <Box key={creator.streamerId} sx={{ mb: 2, pb: 2, borderBottom: index < 2 ? '1px solid rgba(255,255,255,0.1)' : 'none' }}>
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
                            {creator.streamerName}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', ml: 1 }}>
                          {creator.productCount} produto{creator.productCount > 1 ? 's' : ''} ativo{creator.productCount > 1 ? 's' : ''}
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