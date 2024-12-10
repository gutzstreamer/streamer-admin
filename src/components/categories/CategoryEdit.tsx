import React from 'react';
import { Edit, SimpleForm, TextInput } from 'react-admin';

const CategoryEdit: React.FC = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="description" />
        </SimpleForm>
    </Edit>
);

export default CategoryEdit;