import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  DateField,
  ArrayField,
  Datagrid,
} from "react-admin";

const SessionShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="Session ID" />
      <TextField source="userId" label="User ID" />
      <TextField source="ipAddress" label="IP Address" />
      <TextField source="userAgent" label="User Agent" />
      <TextField source="device" label="Device" />
      <BooleanField source="isActive" label="Active?" />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="lastActivity" label="Last Activity" showTime />
      <DateField source="expiresAt" label="Expires At" showTime />
      <DateField source="endedAt" label="Ended At" showTime />
      <TextField source="location" label="Location" />

      {/* Lista de logs da sessão */}
      <ArrayField source="logs" label="Logs">
        <Datagrid>
          <TextField source="id" label="Log ID" />
          <TextField source="endpoint" label="Endpoint" />
          <TextField source="method" label="Method" />
          <TextField source="statusCode" label="Status Code" />
          <TextField source="ipAddress" label="IP Address" />
          <TextField source="userAgent" label="User Agent" />
          <DateField source="createdAt" label="Timestamp" showTime />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default SessionShow;
