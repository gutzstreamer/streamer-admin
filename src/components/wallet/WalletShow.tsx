import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField, DateField, ReferenceField } from 'react-admin';

const WalletShow: React.FC = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="pixKey" />
            <ReferenceField source="userId" reference="users">
                <TextField source="name" />
            </ReferenceField>
            <NumberField source="balance" />
            <NumberField source="pendingBalance" />
            <TextField source="type" />
            <TextField source="currency" />
            <TextField source="status" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);

export default WalletShow;