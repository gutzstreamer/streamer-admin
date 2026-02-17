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
  ChipField,
  TopToolbar,
  Button,
  useNotify,
  useRefresh,
  useDataProvider,
} from "react-admin";
import RefreshIcon from "@mui/icons-material/Refresh";
import { DatePresetInput } from "../common/DatePresetInput";

import { webhookStatusChoices, eventTypeChoices } from "./index";
import { DataProviderWithCustomMethods } from "../../dataProvider";

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
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

const PlatformWebhookListActions: React.FC = () => {
  const notify = useNotify();
  const refresh = useRefresh();
  const dataProvider = useDataProvider<DataProviderWithCustomMethods>();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleRenew = async () => {
    setIsLoading(true);
    try {
      await dataProvider.renewYouTubeWebhooks();
      notify("YouTube webhook renewal triggered", { type: "info" });
      refresh();
    } catch (error: any) {
      const message =
        error?.body?.message ||
        error?.message ||
        "Failed to trigger YouTube webhook renewal";
      notify(message, { type: "warning" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TopToolbar>
      <Button
        label="Renovar webhooks YouTube"
        onClick={handleRenew}
        disabled={isLoading}
      >
        <RefreshIcon />
      </Button>
    </TopToolbar>
  );
};

const PlatformWebhookList: React.FC = (props) => {
  return (
    <List perPage={25} pagination={<DefaultPagination />}
      {...props}
      filters={<PlatformWebhookListFilter />}
      actions={<PlatformWebhookListActions />}
      sort={{ field: "createdAt", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="id" label="Webhook ID" />
        <TextField source="subscriptionId" label="Subscription ID" />
        <ReferenceField 
          source="integrationId" 
          reference="streaming-platform-integrations" 
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





