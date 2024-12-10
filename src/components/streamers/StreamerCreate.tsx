import React from 'react';
import { Create, SimpleForm, TextInput } from 'react-admin';

const StreamerCreate: React.FC = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="userId" />
            <TextInput source="bio" />
            <TextInput source="image" />
        </SimpleForm>
    </Create>
);

export default StreamerCreate;