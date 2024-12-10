import React from 'react';
import { Create, SimpleForm, TextInput, required } from 'react-admin';

const UserCreate: React.FC = (props) => {
  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="username" label="Username" validate={required()} />
        <TextInput source="email" label="Email" validate={required()} />
        <TextInput source="password" label="Password" type="password" validate={required()} />
      </SimpleForm>
    </Create>
  );
};

export default UserCreate;