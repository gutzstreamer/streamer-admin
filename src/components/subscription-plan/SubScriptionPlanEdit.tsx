import React from 'react';
import { Edit, SimpleForm, TextInput, NumberInput } from 'react-admin';

const SubscriptionPlanEdit: React.FC = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="description" />
            <NumberInput source="price" />
            <NumberInput source="duration" />
            <NumberInput source="donationWithDrawallFee" />
            <NumberInput source="donationWithDrawallLimit" />
            <NumberInput source="storeWithDrawallFee" />
            <NumberInput source="storeWithDrawallLimit" />
        </SimpleForm>
    </Edit>
);

export default SubscriptionPlanEdit;