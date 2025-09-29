import React from "react";
import {
  TextField,
  DateField,
  BooleanField,
  ReferenceField,
  Show,
  ChipField,
  FunctionField,
  ArrayField,
  Datagrid,
  TabbedShowLayout,
  Tab,
} from "react-admin";
import StreamingPlatformIntegrationShowActions from "./StreamingPlatformIntegrationShowActions";

const StreamingPlatformIntegrationShow: React.FC = (props) => (
  <Show
    {...props}
    actions={<StreamingPlatformIntegrationShowActions />}
  >
    <TabbedShowLayout>
      <Tab label="Integration Details">
        <TextField source="id" label="Integration ID" />
        <ReferenceField
          source="streamerId"
          reference="streamers"
          label="Streamer"
          link="show"
        >
          <TextField source="name" />
        </ReferenceField>
        <ChipField
          source="platform"
          label="Platform"
          sx={{
            "& .MuiChip-root": {
              backgroundColor: (record: any) => {
                switch (record.platform) {
                  case "TWITCH":
                    return "#9146ff";
                  case "YOUTUBE":
                    return "#ff0000";
                  case "TIKTOK":
                    return "#000000";
                  default:
                    return "#gray";
                }
              },
              color: "white",
            },
          }}
        />
        <TextField source="platformUserId" label="Platform User ID" />
        <TextField source="platformUsername" label="Platform Username" />
        <BooleanField source="isActive" label="Active" />
        <DateField source="tokenExpiry" label="Token Expiry" showTime />
        <DateField source="createdAt" label="Created At" showTime />
        <DateField source="updatedAt" label="Updated At" showTime />
      </Tab>

      <Tab label="Scope & Permissions">
        <ArrayField source="scope" label="Scopes">
          <Datagrid>
            <FunctionField
              render={(record: any) => (
                <ChipField
                  record={{ scope: record }}
                  source="scope"
                  sx={{
                    "& .MuiChip-root": {
                      backgroundColor: "#1976d2",
                      color: "white",
                    },
                  }}
                />
              )}
            />
          </Datagrid>
        </ArrayField>
      </Tab>

      <Tab label="Statistics">
        <FunctionField
          label="Total Subscribers"
          render={(record: any) => record.subscribersCount || 0}
        />
        <FunctionField
          label="Total Webhooks"
          render={(record: any) => record.webhooksCount || 0}
        />
      </Tab>
    </TabbedShowLayout>
  </Show>
);

export default StreamingPlatformIntegrationShow;
