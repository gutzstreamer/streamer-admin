import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  ShowButton,
  BooleanField,
  TextInput,
  SelectInput,
  Filter,
} from "react-admin";

const StreamerFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Streamer ID" source="id" alwaysOn />
    <TextInput label="User ID" source="userId" alwaysOn />
    <TextInput label="Name" source="name" alwaysOn />
    <TextInput label="Atname" source="atname" alwaysOn />
    <SelectInput
      label="Público"
      source="public"
      choices={[
        { id: true, name: "Sim" },
        { id: false, name: "Não" },
      ]}
      emptyText="Todos"
    />
  </Filter>
);

const StreamerList: React.FC = (props) => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<StreamerFilter />}
      sort={{ field: "id", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="atname" />
        <BooleanField source="public" />
        <ReferenceField source="userId" reference="users">
          <TextField source="name" />
        </ReferenceField>
        <ShowButton />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default StreamerList;



