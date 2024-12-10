import React from 'react';
import { Create, SimpleForm, TextInput, ReferenceInput, SelectInput } from 'react-admin';

const StreamerCreate: React.FC = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ReferenceInput source="userId" reference="users">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <TextInput source="bio" />
            <TextInput source="image" />
        </SimpleForm>
    </Create>
);

export default StreamerCreate;