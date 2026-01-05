import React from "react";
import { BooleanField, Datagrid, List, NumberField, TextField } from "react-admin";

const TierConfigList: React.FC = (props) => (
  <List {...props} perPage={10}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="tier" />
      <NumberField source="minPriceReais" label="Min price (R$)" options={{ minimumFractionDigits: 2 }} />
      <TextField source="currency" />
      <BooleanField source="active" />
    </Datagrid>
  </List>
);

export default TierConfigList;
