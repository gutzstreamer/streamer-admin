import React from "react";
import {
  BooleanField,
  DateField,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const PlatformBenefitShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="tier" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="limitPerCycle" />
      <NumberField source="expiresAfterDays" />
      <BooleanField source="active" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);

export default PlatformBenefitShow;
