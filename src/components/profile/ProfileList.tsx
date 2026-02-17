import React from "react";
import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  Filter,
  TextInput,
} from "react-admin";

const ProfileFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="ID do Perfil" source="id" alwaysOn />
    <TextInput label="ID do UsuÃ¡rio" source="userId" />
    <TextInput label="Apelido" source="nickname" />
  </Filter>
);

const ProfileList: React.FC = (props) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<ProfileFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID do Perfil" />
      <ReferenceField source="userId" reference="users" label="UsuÃ¡rio" link="show">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="nickname" label="Apelido" />
    </Datagrid>
  </List>
);

export default ProfileList;

