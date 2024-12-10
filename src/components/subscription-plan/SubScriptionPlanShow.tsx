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
            <NumberField source="commissionPlataform" />
            <NumberField source="commissionStreamer" />
            <NumberField source="donationFeeValue" />
            <NumberField source="storeFeeValue" />
            <NumberField source="allowedWithdrawals" />
            <NumberField source="withdrawalFeeValue" />
        </SimpleShowLayout>
    </Show>
);

export default SubscriptionPlanShow;