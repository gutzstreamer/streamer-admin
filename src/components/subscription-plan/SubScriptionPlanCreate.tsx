import React from 'react';
import { Create, SimpleForm, TextInput, NumberInput } from 'react-admin';

const SubscriptionPlanCreate: React.FC = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="description" />
            <NumberInput source="price" />
            <NumberInput source="duration" />
            <NumberInput source="donationFee" />
            <NumberInput source="donationWithDrawallFee" />
            <NumberInput source="donationWithDrawallLimit" />
            <NumberInput source="marketWithDrawallFee" />
            <NumberInput source="marketWithDrawallLimit" />
        </SimpleForm>
    </Create>
);

export default SubscriptionPlanCreate;