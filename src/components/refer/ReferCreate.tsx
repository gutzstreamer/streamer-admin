import {
  Create,
  SimpleForm,
  ReferenceInput,
  AutocompleteInput,
  NumberInput,
  BooleanInput,
  required,
  number,
  minValue,
  maxValue,
} from 'react-admin';
import { Box, Typography, Alert } from '@mui/material';

export const ReferCreate = () => {
  return (
    <Create>
      <SimpleForm>
        <Typography variant="h6" gutterBottom>
          Nova Indicação
        </Typography>

        <Alert severity="info" sx={{ mb: 2 }}>
          <strong>Importante:</strong> Um streamer só pode ter UMA indicação ativa por vez.
          Se o streamer indicado já possui uma indicação, ela será substituída.
        </Alert>

        <Box display="flex" gap={2} width="100%">
          <ReferenceInput
            source="referrerStreamerId"
            reference="streamers"
            label="Streamer Indicador (quem recebe comissão)"
            sx={{ flex: 1 }}
          >
            <AutocompleteInput
              optionText={(choice) =>
                choice.id
                  ? `${choice.name} (@${choice.atname})`
                  : ''
              }
              filterToQuery={(searchText) => ({ name: searchText })}
              validate={[required()]}
            />
          </ReferenceInput>

          <ReferenceInput
            source="referredStreamerId"
            reference="streamers"
            label="Streamer Indicado (quem gera comissão)"
            sx={{ flex: 1 }}
          >
            <AutocompleteInput
              optionText={(choice) =>
                choice.id
                  ? `${choice.name} (@${choice.atname})`
                  : ''
              }
              filterToQuery={(searchText) => ({ name: searchText })}
              validate={[required()]}
            />
          </ReferenceInput>
        </Box>

        <Box display="flex" gap={2} width="100%">
          <NumberInput
            source="commissionPercent"
            label="Percentual de Comissão (%)"
            validate={[number(), minValue(0), maxValue(100)]}
            defaultValue={0}
            helperText="Percentual que o indicador recebe das vendas do indicado (0-100)"
            sx={{ flex: 1 }}
          />

          <NumberInput
            source="durationMonths"
            label="Duração (meses)"
            validate={[number(), minValue(0)]}
            defaultValue={0}
            helperText="0 = Permanente/Indeterminado"
            sx={{ flex: 1 }}
          />
        </Box>

        <BooleanInput
          source="isActive"
          label="Ativar indicação imediatamente"
          defaultValue={false}
          helperText="Se marcado, a indicação começará a gerar comissões imediatamente"
        />

        <Alert severity="warning" sx={{ mt: 2 }}>
          <Typography variant="body2">
            <strong>Como funciona:</strong>
          </Typography>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>O <strong>Indicador</strong> recebe o percentual de comissão configurado</li>
            <li>A comissão é calculada sobre as vendas do <strong>Indicado</strong></li>
            <li>Se duração = 0, a indicação nunca expira (até ser pausada manualmente)</li>
            <li>Se duração &gt; 0, a indicação expira automaticamente após X meses</li>
          </ul>
        </Alert>
      </SimpleForm>
    </Create>
  );
};
