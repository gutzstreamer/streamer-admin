import React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const UserShow: React.FC = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="email" />
            <TextField source="identityNumber" />
        </SimpleShowLayout>
    </Show>
);

export default UserShow;