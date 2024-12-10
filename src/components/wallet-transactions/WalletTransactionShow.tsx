import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField, DateField, ReferenceField } from 'react-admin';

const WalletTransactionShow: React.FC = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" />
            <ReferenceField source="walletId" reference="wallets">
                <TextField source="id" />
            </ReferenceField>
            <NumberField source="amount" />
            <TextField source="type" />
            <TextField source="status" />
            <TextField source="description" />
            <TextField source="txId" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
        </SimpleShowLayout>
    </Show>
);

export default WalletTransactionShow;