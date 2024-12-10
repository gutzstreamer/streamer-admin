import React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const CategoryShow: React.FC = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="description" />
        </SimpleShowLayout>
    </Show>
);

export default CategoryShow;