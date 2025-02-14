import {
  BooleanField,
  DateField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";
import React from "react";

const FeatureToggleShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <BooleanField source="active" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export default FeatureToggleShow;
