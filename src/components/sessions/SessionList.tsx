import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  DateInput,
  TextInput,
  SelectInput,
  ReferenceField,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const SessionFilter = [
  <TextInput label="ID do Usuário" source="userId" alwaysOn />,
  <SelectInput
    key="isActive"
    label="Ativa"
    source="isActive"
    choices={[
      { id: true, name: "Sim" },
      { id: false, name: "Não" },
    ]}
    emptyText="Todas"
  />,
  <DatePresetInput key="datePreset" source="datePreset" label="Período" />, 
  <DateInput key="lastActivity_gte" label="Última atividade após" source="lastActivity_gte" />,
  <DateInput key="lastActivity_lte" label="Última atividade antes" source="lastActivity_lte" />,
];

const SessionList = (props: any) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={SessionFilter}
    sort={{ field: "lastActivity", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID da Sessão" />
      <ReferenceField source="userId" reference="users" label="Usuário">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="ipAddress" label="IP" />
      <TextField source="userAgent" label="User Agent" />
      <BooleanField source="isActive" label="Ativa" />
      <DateField source="createdAt" label="Criado em" showTime />
      <DateField source="lastActivity" label="Última Atividade" showTime />
    </Datagrid>
  </List>
);

export default SessionList;



