import React from "react";
import {
  BooleanField,
  Datagrid,
  DateField,
  List,
  NumberField,
  TextField,
} from "react-admin";

const PlatformBenefitList: React.FC = (props) => (
  <List {...props} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="tier" />
      <TextField source="type" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="limitPerCycle" />
      <NumberField source="expiresAfterDays" />
      <BooleanField source="active" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export default PlatformBenefitList;
