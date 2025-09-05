import React from 'react';
import { Show, SimpleShowLayout, TextField, NumberField } from 'react-admin';

const SubscriptionPlanShow: React.FC = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
        <TextField source="id" />
            <TextField source="name" />
            <TextField source="description" />
            <NumberField source="price" />
            <NumberField source="duration" />
            <NumberField source="donationWithDrawallFee" />
            <NumberField source="donationWithDrawallLimit" />
            <NumberField source="marketWithDrawallFee" />
            <NumberField source="marketWithDrawallLimit" />
        </SimpleShowLayout>
    </Show>
);

export default SubscriptionPlanShow;