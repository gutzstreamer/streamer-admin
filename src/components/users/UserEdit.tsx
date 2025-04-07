import React from 'react';
import { BooleanInput, Edit, SimpleForm, TextInput, required } from 'react-admin';

const UserEdit: React.FC = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="name" validate={required()} />
        <TextInput source="email" validate={required()} />
        <TextInput source="phone" validate={required()} />
        <TextInput source="identityNumber" validate={required()} />
        <BooleanInput source="active" />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;