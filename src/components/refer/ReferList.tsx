import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  DateInput,
  DateField,
  ReferenceField,
  FunctionField,
  useRecordContext,
  TopToolbar,
  ExportButton,
  CreateButton,
  BooleanInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
} from 'react-admin';
import { Chip, Box } from '@mui/material';
import { CheckCircle, Cancel, Timer } from '@mui/icons-material';
import { DatePresetInput } from "../common/DatePresetInput";

// Função para calcular dias restantes
const calculateRemainingDays = (expiresAt: string, isActive: boolean) => {
  if (!isActive) return 0;
  const now = new Date();
  const expires = new Date(expiresAt);
  const diffTime = expires.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
};

// Campo customizado para status
const StatusField = () => {
  const record = useRecordContext();
  if (!record) return null;

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
          size="small"
        />
      ) : isExpired ? (
        <Chip
          icon={<Cancel />}
          label="Expirado"
          color="error"
          size="small"
        />
      ) : (
        <Chip
          icon={<Cancel />}
          label="Pausado"
          color="warning"
          size="small"
        />
      )}
    </Box>
  );
};

// Campo customizado para dias restantes
const RemainingDaysField = () => {
  const record = useRecordContext();
  if (!record) return null;

  const remainingDays = calculateRemainingDays(record.expiresAt, record.isActive);

  return (
    <Box display="flex" alignItems="center" gap={0.5}>
      <Timer fontSize="small" color={remainingDays > 30 ? 'success' : 'warning'} />
      <span>{remainingDays} dias</span>
    </Box>
  );
};

const ListActions = () => (
  <TopToolbar>
    <CreateButton />
    <ExportButton />
  </TopToolbar>
);

const referFilters = [
  <ReferenceInput
    key="referrerStreamerId"
    source="referrerStreamerId"
    reference="streamers"
    label="Indicador"
    alwaysOn
  >
    <AutocompleteInput
      optionText={(choice) =>
        choice.id ? `${choice.name} (@${choice.atname})` : ''
      }
      filterToQuery={(searchText) => ({ name: searchText })}
    />
  </ReferenceInput>,
  <ReferenceInput
    key="referredStreamerId"
    source="referredStreamerId"
    reference="streamers"
    label="Indicado"
    alwaysOn
  >
    <AutocompleteInput
      optionText={(choice) =>
        choice.id ? `${choice.name} (@${choice.atname})` : ''
      }
      filterToQuery={(searchText) => ({ name: searchText })}
    />
  </ReferenceInput>,
  <BooleanInput key="isActive" source="isActive" label="Apenas Ativos" />,
  <DatePresetInput key="datePreset" source="datePreset" label="Período" />, 
  <DateInput key="createdAt_gte" source="createdAt_gte" label="Criado após" />,
  <DateInput key="createdAt_lte" source="createdAt_lte" label="Criado antes" />,
];

export const ReferList = () => {
  return (
    <List pagination={<DefaultPagination />}
      actions={<ListActions />}
      filters={referFilters}
      perPage={25}
      sort={{ field: 'createdAt', order: 'DESC' }}
    >
      <Datagrid rowClick="show" bulkActionButtons={false}>
        <ReferenceField
          source="referrerStreamerId"
          reference="streamers"
          label="Indicador"
          link="show"
        >
          <FunctionField
            render={(record: any) => (
              <Box display="flex" alignItems="center" gap={1}>
                {record.image && (
                  <img
                    src={record.image}
                    alt={record.name}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box>
                  <div>{record.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    @{record.atname}
                  </div>
                </Box>
              </Box>
            )}
          />
        </ReferenceField>

        <ReferenceField
          source="referredStreamerId"
          reference="streamers"
          label="Indicado"
          link="show"
        >
          <FunctionField
            render={(record: any) => (
              <Box display="flex" alignItems="center" gap={1}>
                {record.image && (
                  <img
                    src={record.image}
                    alt={record.name}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                )}
                <Box>
                  <div>{record.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>
                    @{record.atname}
                  </div>
                </Box>
              </Box>
            )}
          />
        </ReferenceField>

        <FunctionField
          label="Comissão"
          render={(record: any) => `${record.commissionPercent}%`}
        />

        <FunctionField
          label="Duração"
          render={(record: any) => `${record.durationMonths} meses`}
        />

        <StatusField />

        <RemainingDaysField />

        <DateField source="startDate" label="Data Início" locales="pt-BR" />
        <DateField source="expiresAt" label="Expira em" locales="pt-BR" />
        <DateField source="createdAt" label="Criado em" locales="pt-BR" />
      </Datagrid>
    </List>
  );
};



