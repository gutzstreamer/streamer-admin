import React from "react";
import { ReferenceField, Show, SimpleShowLayout, TextField } from "react-admin";

export const AddressShow: React.FC = (props) => (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" label="ID do Endereço" />
        <ReferenceField source="profileId" reference="profiles" label="Perfil" link="show">
           <TextField source="nickname" />
        </ReferenceField>
        <TextField source="nickname" label="Apelido" />
        <TextField source="street" label="Rua" />
        <TextField source="number" label="Número" />
        <TextField source="complement" label="Complemento" />
        <TextField source="neighborhood" label="Bairro" />
        <TextField source="city" label="Cidade" />
        <TextField source="state" label="Estado" />
        <TextField source="country" label="País" />
        <TextField source="zipcode" label="CEP" />
      </SimpleShowLayout>
    </Show>
  );