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
  BooleanField,
  ChipField,
  FunctionField,
} from "react-admin";

import { platformTypeChoices, statusChoices } from "./index";

const StreamingPlatformIntegrationListFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Streamer ID" source="streamerId" />
    <SelectInput
      label="Platform"
      source="platform"
      choices={platformTypeChoices}
    />
    <SelectInput
      label="Status"
      source="isActive"
      choices={statusChoices}
    />
  </Filter>
);

const StreamingPlatformIntegrationList: React.FC = (props) => {
  return (
    <List 
      {...props} 
      filters={<StreamingPlatformIntegrationListFilter />}
    >
      <Datagrid rowClick="show">
        <TextField source="id" label="Integration ID" />
        <ReferenceField source="streamerId" reference="streamers" label="Streamer">
          <TextField source="name" />
        </ReferenceField>
        <ChipField 
          source="platform" 
          label="Platform"
          sx={{
            '& .MuiChip-root': {
              backgroundColor: (record: any) => {
                switch (record.platform) {
                  case 'TWITCH':
                    return '#9146ff';
                  case 'YOUTUBE':
                    return '#ff0000';
                  case 'TIKTOK':
                    return '#000000';
                  default:
                    return '#gray';
                }
              },
              color: 'white',
            }
          }}
        />
        <TextField source="platformUsername" label="Platform Username" />
        <TextField source="platformUserId" label="Platform User ID" />
        <BooleanField source="isActive" label="Active" />
        <FunctionField
          label="Subscribers"
          render={(record: any) => record._count?.subscribers || 0}
        />
        <FunctionField
          label="Webhooks"
          render={(record: any) => record._count?.webhooks || 0}
        />
        <DateField source="tokenExpiry" label="Token Expiry" showTime />
        <DateField source="createdAt" label="Created At" showTime />
        <DateField source="updatedAt" label="Updated At" showTime />
      </Datagrid>
    </List>
  );
};

export default StreamingPlatformIntegrationList;