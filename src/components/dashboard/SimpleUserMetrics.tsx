import React, { memo } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Avatar,
} from '@mui/material';
import {
  People,
  Block,
  CheckCircle,
  PersonOff,
} from '@mui/icons-material';

interface UserData {
  total: {
    totalUsers: number;
    totalStreamers: number;
    usersActive: number;
    usersInactive: number;
    usersBlocked: number;
    usersUnblocked: number;
    streamersWithProducts: number;
  };
  last30Days: {
    totalUsers: number;
    totalStreamers: number;
    usersActive: number;
    usersInactive: number;
    usersBlocked: number;
    usersUnblocked: number;
    newUsers: number;
    streamersWithProducts: number;
  };
}

interface UserMetricsProps {
  data: UserData;
}

export const SimpleUserMetrics: React.FC<UserMetricsProps> = memo(({ data }) => {
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
            <People sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              👥 Métricas de Usuários
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              Estatísticas totais de usuários
            </Typography>
          </Box>
        </Box>

        {/* Card do Total de Usuários - Destaque */}
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
              <People sx={{ fontSize: 32 }} />
            </Avatar>
            <Typography variant="h4" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' } }}>
              {currentData.totalUsers.toLocaleString()}
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 500, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
              Total de Usuários Criados
            </Typography>
          </Box>
        </Box>

        {/* Cards das métricas de status */}
        <Box mb={4}>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📊 Status dos Usuários
          </Typography>
          
          <Grid container spacing={3}>
            {/* Usuários Ativos */}
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
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.usersActive.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Usuários Ativos
                </Typography>
              </Box>
            </Grid>

            {/* Usuários Inativos */}
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
                  <PersonOff />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.usersInactive.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Usuários Inativos
                </Typography>
              </Box>
            </Grid>

            {/* Usuários Bloqueados */}
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
                  <Block />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.usersBlocked.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Usuários Bloqueados
                </Typography>
              </Box>
            </Grid>

            {/* Usuários Desbloqueados */}
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
                  <CheckCircle />
                </Avatar>
                <Typography variant="h5" fontWeight="bold" color="white" mb={1} sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
                  {currentData.usersUnblocked.toLocaleString()}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500, fontSize: '0.75rem' }}>
                  Usuários Desbloqueados
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Resumo Estatístico */}
        <Box>
          <Typography variant="h6" fontWeight="bold" mb={3} color="white">
            📈 Resumo Estatístico
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={6}>
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
                  {((currentData.usersActive / currentData.totalUsers) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Taxa de Usuários Ativos
                </Typography>
              </Box>
            </Grid>
            
            <Grid item xs={6}>
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
                  {((currentData.usersBlocked / currentData.totalUsers) * 100).toFixed(1)}%
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Taxa de Usuários Bloqueados
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
});