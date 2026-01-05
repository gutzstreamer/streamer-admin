import {
  Datagrid,
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

const filters = [
  <TextInput key="broadcasterId" source="broadcasterId" label="Broadcaster ID" />,
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
];

const ListActions = () => {
  const { defaultTitle } = useListContext();
  return <TopToolbar>{defaultTitle}</TopToolbar>;
};

const ChatMentionList = (props: ListProps) => (
  <List
    {...props}
    filters={filters}
    sort={{ field: "capturedAt", order: "DESC" }}
    perPage={25}
    actions={<ListActions />}
  >
    <Datagrid rowClick={false}>
      <TextField source="broadcasterId" label="Broadcaster ID" />
      <TextField source="broadcasterName" label="Canal" />
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
