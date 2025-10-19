import {
  Edit,
  SimpleForm,
  NumberInput,
  BooleanInput,
  ReferenceInput,
  AutocompleteInput,
  required,
  minValue,
  maxValue,
  useRecordContext,
} from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';

const ReferTitle = () => {
  const record = useRecordContext();
  return <span>Editar Indicação {record ? `#${String(record.id).slice(0, 8)}` : ''}</span>;
};

export const ReferEdit = () => {
  return (
    <Edit title={<ReferTitle />} mutationMode="pessimistic">
      <SimpleForm>
        <Alert severity="info" sx={{ mb: 2, width: '100%' }}>
          <Typography variant="body2">
            <strong>Atenção:</strong> Não é possível alterar o indicador ou o indicado após a criação.
            Você pode apenas ajustar a comissão, duração e status.
          </Typography>
        </Alert>

        <Typography variant="h6" gutterBottom>
          👤 Indicador (quem recebe comissão)
        </Typography>
        <ReferenceInput
          source="referrerStreamerId"
          reference="streamers"
          label="Streamer Indicador"
        >
          <AutocompleteInput
            optionText={(choice) => `${choice.name} (@${choice.atname})`}
            disabled
            fullWidth
          />
        </ReferenceInput>

        <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
          🎯 Indicado (quem foi indicado)
        </Typography>
        <ReferenceInput
          source="referredStreamerId"
          reference="streamers"
          label="Streamer Indicado"
        >
          <AutocompleteInput
            optionText={(choice) => `${choice.name} (@${choice.atname})`}
            disabled
            fullWidth
          />
        </ReferenceInput>

        <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
          💰 Configurações
        </Typography>
        <NumberInput
          source="commissionPercent"
          label="Percentual de Comissão (%)"
          validate={[required(), minValue(0), maxValue(100)]}
          helperText="Percentual que o indicador receberá das vendas do indicado"
          fullWidth
        />

        <NumberInput
          source="durationMonths"
          label="Duração (meses)"
          validate={[required(), minValue(1)]}
          helperText="Duração da indicação em meses. Ao alterar, a data de expiração será recalculada."
          fullWidth
        />

        <Box mt={2}>
          <BooleanInput
            source="isActive"
            label="Ativo"
            helperText="Desativar pausa o timer. Reativar adiciona os dias pausados à data de expiração."
          />
        </Box>
      </SimpleForm>
    </Edit>
  );
};
