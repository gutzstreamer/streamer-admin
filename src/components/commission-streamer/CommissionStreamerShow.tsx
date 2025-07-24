import React from "react";
import {
  DateField,
  NumberField,
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
      <ReferenceField source="productStreamerId" reference="product-streamer">
        <TextField source="name" />
      </ReferenceField>

      <NumberField
        source="productSalePrice"
        options={{ style: 'currency', currency: 'BRL' }}
        locales="pt-BR"
      />
      <TextField source="productSaleQuantity" />
      <TextField source="percentage" />
      <NumberField
        source="commissionValue"
        options={{ style: 'currency', currency: 'BRL' }}
        locales="pt-BR"
      />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);

export default CommissionStreamerShow;