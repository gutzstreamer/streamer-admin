import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  Datagrid,
  ReferenceField,
  FunctionField,
} from "react-admin";

export const ProfileShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID do Perfil" />
      <ReferenceField source="userId" reference="users" label="Usuário" link="show">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="image" label="Imagem" />
      <TextField source="nickname" label="Apelido" />
      <ArrayField source="address" label="Endereços">
        <Datagrid rowClick={false}>
          <TextField source="nickname" label="Apelido" />
          <TextField source="street" label="Rua" />
          <TextField source="number" label="Número" />
          <TextField source="complement" label="Complemento" />
          <TextField source="neighborhood" label="Bairro" />
          <TextField source="city" label="Cidade" />
          <TextField source="state" label="Estado" />
          <TextField source="country" label="País" />
          <TextField source="zipcode" label="CEP" />
          <FunctionField
            label="Ver Detalhes"
            render={(record: any) => (
              <a href={`#/address/${record.id}/show`} onClick={(e) => e.stopPropagation()}>
                Ver Detalhes
              </a>
            )}
          />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);