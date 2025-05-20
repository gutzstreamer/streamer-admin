import React from "react";
import {
  DateField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  TextField,
} from "react-admin";

const CommissionStreamerShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="orderId" reference="orders">
        <TextField source="id" />
      </ReferenceField>
      <TextField source="orderProductId" />
      <TextField source="taxComissionId" />
      <TextField source="commissionValue" />
      <TextField source="percentage" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);

export default CommissionStreamerShow;

//     {
//         "id": "9b1fa3ca-5d0f-4638-ba3e-00c1c57bfd69",
//         "streamerId": "d012fec0-f352-4dfd-ac12-1c9b6df9959e",
//         "orderId": "97758afd-c7dd-4b1b-bd5e-41f26715c15f",
//         "orderProductId": "26bfd778-d73d-4e11-a45a-1d35c753d286",
//         "taxComissionId": "504d1bfa-7aab-4edc-a27b-031e1b52da75",
//         "commissionValue": 23.7,
//         "percentage": 15,
//         "createdAt": "2025-05-20T20:09:16.699Z"
//     }
