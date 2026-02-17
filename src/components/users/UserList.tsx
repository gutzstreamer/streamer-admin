import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  Filter,
  TextInput,
  SelectInput,
  ListProps,
} from "react-admin";

const UserListFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="ID" source="id" alwaysOn />
    <TextInput label="Name" source="name" alwaysOn />
    <TextInput label="Email" source="email" />
    <TextInput label="Phone" source="phone" />
    <SelectInput
      label="Active"
      source="active"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
    <SelectInput
      label="Blocked"
      source="blocked"
      choices={[
        { id: true, name: "Yes" },
        { id: false, name: "No" },
      ]}
      emptyText="All"
    />
  </Filter>
);

const UserList = (props: ListProps) => {
  return (
    <List
      perPage={25}
      pagination={<DefaultPagination />}
      {...props}
      filters={<UserListFilter />}
      sort={{ field: "id", order: "DESC" }}
    >
      <Datagrid rowClick="show">
        <TextField source="name" />
        <TextField source="id" />
        <TextField source="email" />
        <TextField source="phone" />
        <TextField source="identityNumber" />
        <TextField source="active" />
        <TextField source="blocked" />
      </Datagrid>
    </List>
  );
};

export default UserList;

