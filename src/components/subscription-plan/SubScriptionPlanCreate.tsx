import React from 'react';
import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';

const SubscriptionPlanCreate: React.FC = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="description" />
            <NumberInput source="price" />
            <NumberInput source="duration" />
            <NumberInput source="commissionPlataform" />
            <NumberInput source="commissionStreamer" />
            <NumberInput source="donationFeeValue" />
            <NumberInput source="storeFeeValue" />
            <NumberInput source="allowedWithdrawals" />
            <NumberInput source="withdrawalFeeValue" />
        </SimpleForm>
    </Create>
);

export default SubscriptionPlanCreate;