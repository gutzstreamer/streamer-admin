import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  Datagrid,
  List,
  TextField,
  DateField,
  DateInput,
  ReferenceField,
  Filter,
  SelectInput,
  TextInput,
  BooleanField,
  ChipField,
  FunctionField,
} from "react-admin";

import { platformTypeChoices, statusChoices } from "./index";
import { DatePresetInput } from "../common/DatePresetInput";

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
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

const StreamingPlatformIntegrationList: React.FC = (props) => {
  return (
    <List perPage={25} pagination={<DefaultPagination />} 
      {...props} 
      filters={<StreamingPlatformIntegrationListFilter />}
      sort={{ field: "createdAt", order: "DESC" }}
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




