import React from 'react';
import { Edit, SimpleForm, TextInput, required } from 'react-admin';

const UserEdit: React.FC = (props) => {
  return (
    <Edit {...props}>
      <SimpleForm>
        <TextInput source="id" disabled />
        <TextInput source="name" validate={required()} />
        <TextInput source="email" validate={required()} />
        <TextInput source="username" validate={required()} />
      </SimpleForm>
    </Edit>
  );
};

export default UserEdit;