import { DefaultPagination } from "../common/DefaultPagination";
import {
  Datagrid,
  DateInput,
  DateField,
  FunctionField,
  List,
  ListProps,
  SelectInput,
  TextField,
  TextInput,
  TopToolbar,
  useListContext,
} from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const filters = [
  <TextInput
    key="broadcasterId"
    source="broadcasterId"
    label="Broadcaster ID"
  />,
  <SelectInput
    key="platform"
    source="platform"
    label="Plataforma"
    choices={[
      { id: "TWITCH", name: "Twitch" },
      { id: "YOUTUBE", name: "YouTube" },
      { id: "KICK", name: "Kick" },
    ]}
  />,
  <SelectInput
    key="matchType"
    source="matchType"
    label="Tipo de Match"
    choices={[
      { id: "self", name: "Nossa" },
      { id: "competitor", name: "Concorrente" },
      { id: "none", name: "Nenhum" },
    ]}
  />,
  <DatePresetInput key="datePreset" source="datePreset" label="Período" />, 
  <DateInput key="capturedAt_gte" source="capturedAt_gte" label="Capturado após" />,
  <DateInput key="capturedAt_lte" source="capturedAt_lte" label="Capturado antes" />,
  <TextInput key="broadcasterName" label="broadcasterName" source="broadcasterName" />,
  <TextInput key="displayName" label="displayName" source="displayName" />,
  <TextInput key="matchedKeyword" label="matchedKeyword" source="matchedKeyword" />,
  <DateInput key="sentAt" label="sentAt" source="sentAt" />,
];

const ListActions = () => {
  const { defaultTitle } = useListContext();
  return <TopToolbar>{defaultTitle}</TopToolbar>;
};

const ChatMentionList = (props: ListProps) => (
  <List pagination={<DefaultPagination />}
    {...props}
    filters={filters}
    sort={{ field: "capturedAt", order: "DESC" }}
    perPage={25}
    actions={<ListActions />}
  >
    <Datagrid rowClick={false}>
      <TextField source="broadcasterId" label="Broadcaster ID" />
      <TextField source="broadcasterName" label="Canal" />
      <FunctionField
        label="Plataforma"
        render={(record: any) => record.platform || "-"}
      />
      <TextField source="displayName" label="Autor" />
      <TextField source="matchType" label="Tipo" />
      <TextField source="matchedKeyword" label="Keyword" />
      <FunctionField
        label="Mensagem"
        render={(record: any) =>
          record.text?.length > 120
            ? `${record.text.slice(0, 117)}...`
            : record.text
        }
      />
      <DateField source="sentAt" label="Enviado" showTime />
      <DateField source="capturedAt" label="Capturado" showTime />
    </Datagrid>
  </List>
);

export default ChatMentionList;




