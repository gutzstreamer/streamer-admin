import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const StreamerEdit: React.FC = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="userId" />
            <TextInput source="bio" />
            <TextInput source="image" />
        </SimpleForm>
    </Edit>
);

export default StreamerEdit;