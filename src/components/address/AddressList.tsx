import React from "react";
import { List, Datagrid, TextField, ReferenceField } from "react-admin";

export const AddressList: React.FC = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" label="ID do Endereço" />
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
