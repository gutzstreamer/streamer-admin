import React from "react";
import { List, Datagrid, TextField, ReferenceField } from "react-admin";

 const ProfileList: React.FC = (props) => (
    <List {...props}>
      <Datagrid rowClick="show">
        <TextField source="id" label="ID do Perfil" />
        <ReferenceField source="userId" reference="users" label="Usuário" link="show">
           <TextField source="name" />
        </ReferenceField>
        <TextField source="nickname" label="Apelido" />
      </Datagrid>
    </List>
  );
export default ProfileList;
