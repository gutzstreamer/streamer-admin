import {
  List,
  Datagrid,
  TextField,
  BooleanField,
  DateField,
  TextInput,
  ReferenceField,
} from "react-admin";

const SessionFilter = [
  <TextInput label="ID do Usuário" source="userId" alwaysOn />,
];

const SessionList = (props: any) => (
  <List {...props} filters={SessionFilter}>
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
