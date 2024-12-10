import React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';

const StreamerShow: React.FC = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="userId" />
            <TextField source="bio" />
            <TextField source="image" />
        </SimpleShowLayout>
    </Show>
);

export default StreamerShow;