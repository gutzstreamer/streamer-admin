import {
  Show,
  SimpleShowLayout,
  NumberField,
  DateField,
  ReferenceField,
  FunctionField,
  useRecordContext,
  useNotify,
  useRefresh,
  TopToolbar,
  EditButton,
  Button,
} from 'react-admin';
import { Box, Card, CardContent, Typography, Grid, Chip } from '@mui/material';
import { PowerSettingsNew, CheckCircle, Cancel, Timer, TrendingUp } from '@mui/icons-material';
import { useState } from 'react';

const calculateRemainingDays = (expiresAt: string, isActive: boolean) => {
  if (!isActive) return 0;
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffTime = expires.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

const ToggleActiveButton = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const refresh = useRefresh();
  const [loading, setLoading] = useState(false);

  if (!record) return null;

  const handleToggle = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/refer/${record.id}/toggle`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ isActive: !record.isActive }),
        }
      );

      if (!response.ok) throw new Error('Erro ao alterar status');

      notify(
        record.isActive
          ? 'Indicação pausada com sucesso'
          : 'Indicação ativada com sucesso',
        { type: 'success' }
      );
      refresh();
    } catch (error) {
      notify('Erro ao alterar status da indicação', { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      label={record.isActive ? 'Pausar' : 'Ativar'}
      startIcon={<PowerSettingsNew />}
      onClick={handleToggle}
      disabled={loading}
      color={record.isActive ? 'warning' : 'success'}
    />
  );
};

const StatsCard = () => {
  const record = useRecordContext();
  const [stats, setStats] = useState<any>(null);

  useState(() => {
    if (record?.referrerStreamerId) {
      fetch(
        `${import.meta.env.VITE_API_URL}/refer/stats/${record.referrerStreamerId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      )
        .then((res) => res.json())
        .then(setStats)
        .catch(console.error);
    }
  });

  if (!stats) return null;

  return (
    <Card sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📊 Estatísticas do Indicador
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="primary">
                {stats.totalReferred}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Indicados
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">
                {stats.activeRefers}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Ativos
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="info.main">
                {stats.totalCommissions}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Comissões Geradas
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box textAlign="center">
              <Typography variant="h4" color="success.main">
                R$ {stats.totalEarnings.toFixed(2)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Recebido
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ShowActions = () => (
  <TopToolbar>
    <ToggleActiveButton />
    <EditButton />
  </TopToolbar>
);

export const ReferShow = () => {
  return (
    <Show actions={<ShowActions />}>
      <SimpleShowLayout>
        <StatsCard />

        <Box display="flex" gap={2} mb={2}>
          <FunctionField
            label="Status"
            render={(record: any) => {
              const now = new Date();
              const expires = new Date(record.expiresAt);
              const isExpired = expires < now;

              return (
                <Box>
                  {record.isActive && !isExpired ? (
                    <Chip
                      icon={<CheckCircle />}
                      label="Ativo"
                      color="success"
                    />
                  ) : isExpired ? (
                    <Chip icon={<Cancel />} label="Expirado" color="error" />
                  ) : (
                    <Chip icon={<Cancel />} label="Pausado" color="warning" />
                  )}
                </Box>
              );
            }}
          />

          <FunctionField
            label="Dias Restantes"
            render={(record: any) => {
              const remainingDays = calculateRemainingDays(
                record.expiresAt,
                record.isActive
              );
              return (
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Timer
                    fontSize="small"
                    color={remainingDays > 30 ? 'success' : 'warning'}
                  />
                  <Typography>{remainingDays} dias</Typography>
                </Box>
              );
            }}
          />
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          👤 Indicador (quem recebe comissão)
        </Typography>
        <ReferenceField
          source="referrerStreamerId"
          reference="streamers"
          link="show"
        >
          <FunctionField
            render={(record: any) => (
              <Box display="flex" alignItems="center" gap={2}>
                {record.image && (
                  <img
                    src={record.image}
                    alt={record.name}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h6">{record.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{record.atname}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </ReferenceField>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          🎯 Indicado (quem foi indicado)
        </Typography>
        <ReferenceField
          source="referredStreamerId"
          reference="streamers"
          link="show"
        >
          <FunctionField
            render={(record: any) => (
              <Box display="flex" alignItems="center" gap={2}>
                {record.image && (
                  <img
                    src={record.image}
                    alt={record.name}
                    style={{
                      width: 64,
                      height: 64,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box>
                  <Typography variant="h6">{record.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    @{record.atname}
                  </Typography>
                </Box>
              </Box>
            )}
          />
        </ReferenceField>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          💰 Configurações da Indicação
        </Typography>
        <FunctionField
          label="Percentual de Comissão"
          render={(record: any) => (
            <Chip
              icon={<TrendingUp />}
              label={`${record.commissionPercent}%`}
              color="primary"
              variant="outlined"
            />
          )}
        />
        <FunctionField
          label="Duração"
          render={(record: any) => `${record.durationMonths} meses`}
        />
        <NumberField source="totalPausedDays" label="Total de Dias Pausados" />

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          📅 Datas
        </Typography>
        <DateField source="startDate" label="Data de Início" locales="pt-BR" showTime />
        <DateField source="expiresAt" label="Data de Expiração" locales="pt-BR" showTime />
        <DateField source="pausedAt" label="Pausado em" locales="pt-BR" showTime />
        <DateField source="createdAt" label="Criado em" locales="pt-BR" showTime />
        <DateField source="updatedAt" label="Atualizado em" locales="pt-BR" showTime />
      </SimpleShowLayout>
    </Show>
  );
};
