import React from "react";
import {
  Datagrid,
  DateField,
  List,
  ReferenceField,
  TextField,
    TextInput,
    Filter,
} from "react-admin";

  const StreamerRequestFilter: React.FC = (props) => (
    <Filter {...props}>
      <TextInput label="Referral Atname" source="referralAtname" alwaysOn />
    </Filter>
  );
const StreamerRequestList: React.FC = (props) => (
  <List {...props} title="Streamer Requests" filters={<StreamerRequestFilter />}> 
    <Datagrid>
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="atname" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="referralAtname" />
      <TextField source="status" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);

export default StreamerRequestList;
