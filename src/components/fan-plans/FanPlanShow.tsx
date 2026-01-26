import React from "react";
import {
  ArrayField,
  BooleanField,
  Datagrid,
  NumberField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const FanPlanShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="streamerId" label="Streamer" />
      <TextField source="tier" />
      <TextField source="name" />
      <TextField source="description" />
      <TextField source="status" />
      <TextField source="interval" />
      <TextField source="currency" />
      <NumberField source="versions[0].priceCents" label="Price (cents)" />
      <ArrayField source="benefits">
        <Datagrid bulkActionButtons={false}>
          <TextField source="name" />
          <TextField source="description" />
          <NumberField source="limitPerCycle" />
          <NumberField source="expiresAfterDays" />
          <TextField source="platformBenefitId" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default FanPlanShow;
