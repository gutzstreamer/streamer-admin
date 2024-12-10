import React from 'react';
import { Edit, SimpleForm, TextInput, NumberInput } from 'react-admin';

const SubscriptionPlanEdit: React.FC = (props) => (
    <Edit {...props}>
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
    </Edit>
);

export default SubscriptionPlanEdit;