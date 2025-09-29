import React from "react";
import {
  TextField,
  DateField,
  ReferenceField,
  Show,
  ChipField,
  SimpleShowLayout,
  UrlField,
} from "react-admin";
import PlatformWebhookShowActions from "./PlatformWebhookShowActions";

const PlatformWebhookShow: React.FC = (props) => (
  <Show
    {...props}
    actions={<PlatformWebhookShowActions />}
  >
    <SimpleShowLayout>
      <TextField source="id" label="Webhook ID" />
      <TextField source="subscriptionId" label="Subscription ID" />
      <ReferenceField
        source="integrationId"
        reference="streaming-platform-integrations"
        label="Integration"
        link="show"
      >
        <TextField source="platformUsername" />
      </ReferenceField>
      <ChipField
        source="eventType"
        label="Event Type"
        sx={{
          "& .MuiChip-root": {
            backgroundColor: "#4caf50",
            color: "white",
          },
        }}
      />
      <ChipField
        source="status"
        label="Status"
        sx={{
          "& .MuiChip-root": {
            backgroundColor: (record: any) => {
              switch (record.status) {
                case "enabled":
                  return "#4caf50";
                case "disabled":
                  return "#f44336";
                case "webhook_callback_verification_pending":
                  return "#ff9800";
                default:
                  return "#gray";
              }
            },
            color: "white",
          },
        }}
      />
      <TextField
        source="platformBroadcasterId"
        label="Platform Broadcaster ID"
      />
      <UrlField source="callbackUrl" label="Callback URL" />
      <DateField source="lastTriggeredAt" label="Last Triggered At" showTime />
      <DateField source="createdAt" label="Created At" showTime />
      <DateField source="updatedAt" label="Updated At" showTime />
    </SimpleShowLayout>
  </Show>
);

export default PlatformWebhookShow;
