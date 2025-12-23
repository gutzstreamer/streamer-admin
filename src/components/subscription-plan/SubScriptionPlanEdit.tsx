import React from "react";
import { Edit, SimpleForm, TextInput, NumberInput } from "react-admin";

const SubscriptionPlanEdit: React.FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="description" />
      <NumberInput source="price" />
      <NumberInput source="duration" />
      <NumberInput source="donationFee" label="Donation Fee (%)" />
      <NumberInput source="virtualFee" label="Virtual Products Fee (%)" />
      <NumberInput source="donationWithDrawallFee" />
      <NumberInput source="donationWithDrawallLimit" />
      <NumberInput source="marketWithDrawallFee" />
      <NumberInput source="marketWithDrawallLimit" />
    </SimpleForm>
  </Edit>
);

export default SubscriptionPlanEdit;
