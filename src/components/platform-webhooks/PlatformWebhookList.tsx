import React from "react";
import {
  Datagrid,
  List,
  TextField,
  DateField,
  ReferenceField,
  Filter,
  SelectInput,
  TextInput,
  ChipField,
} from "react-admin";

import { webhookStatusChoices, eventTypeChoices } from "./index";

const PlatformWebhookListFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Integration ID" source="integrationId" />
    <TextInput label="Subscription ID" source="subscriptionId" />
    <TextInput label="Broadcaster ID" source="platformBroadcasterId" />
    <SelectInput
      label="Event Type"
      source="eventType"
      choices={eventTypeChoices}
    />
    <SelectInput
      label="Status"
      source="status"
      choices={webhookStatusChoices}
    />
  </Filter>
);

const PlatformWebhookList: React.FC = (props) => {
  return (
    <List 
      {...props} 
      filters={<PlatformWebhookListFilter />}
    >
      <Datagrid rowClick="show">
        <TextField source="id" label="Webhook ID" />
        <TextField source="subscriptionId" label="Subscription ID" />
        <ReferenceField 
          source="integrationId" 
          reference="admin/streaming-platform-integrations" 
          label="Integration"
        >
          <TextField source="platformUsername" />
        </ReferenceField>
        <ChipField 
          source="eventType" 
          label="Event Type"
          sx={{
            '& .MuiChip-root': {
              backgroundColor: '#4caf50',
              color: 'white',
            }
          }}
        />
        <ChipField 
          source="status" 
          label="Status"
          sx={{
            '& .MuiChip-root': {
              backgroundColor: (record: any) => {
                switch (record.status) {
                  case 'enabled':
                    return '#4caf50';
                  case 'disabled':
                    return '#f44336';
                  case 'webhook_callback_verification_pending':
                    return '#ff9800';
                  default:
                    return '#gray';
                }
              },
              color: 'white',
            }
          }}
        />
        <TextField source="platformBroadcasterId" label="Broadcaster ID" />
        <TextField source="callbackUrl" label="Callback URL" />
        <DateField source="lastTriggeredAt" label="Last Triggered" showTime />
        <DateField source="createdAt" label="Created At" showTime />
        <DateField source="updatedAt" label="Updated At" showTime />
      </Datagrid>
    </List>
  );
};

export default PlatformWebhookList;