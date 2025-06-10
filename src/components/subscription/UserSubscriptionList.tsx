import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  DateField,
  ShowButton,
  EditButton,
} from "react-admin";

export const UserSubscriptionList = () => (
  <List>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <ReferenceField source="userId" reference="users" />
      <ReferenceField source="planId" reference="subscription-plan" />
      <TextField source="status" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
