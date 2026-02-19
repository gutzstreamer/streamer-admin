import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  Filter,
  TextInput,
} from "react-admin";

const AddressFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID do EndereÃ§o" source="id" alwaysOn />
    <TextInput label="Profile ID" source="profileId" />
    <TextInput label="Apelido" source="nickname" />
    <TextInput label="Cidade" source="city" />
    <TextInput label="CEP" source="zipcode" />
    <TextInput label="state" source="state" />
    <TextInput label="street" source="street" />
  </Filter>
);

export const AddressList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<AddressFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID do EndereÃ§o" />
      <ReferenceField
        source="profileId"
        reference="profiles"
        label="Perfil"
        link="show"
      >
        <TextField source="nickname" emptyText="No nickname" />
      </ReferenceField>
      <TextField source="nickname" label="Apelido" />
      <TextField source="street" label="Rua" />
      <TextField source="city" label="Cidade" />
      <TextField source="state" label="Estado" />
      <TextField source="zipcode" label="CEP" />
    </Datagrid>
  </List>
);


