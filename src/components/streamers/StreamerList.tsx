import {
  List,
  Datagrid,
  TextField,
  ReferenceField,
  EditButton,
  ShowButton,
  BooleanField,
  TextInput,
  Filter,
} from "react-admin";

const StreamerFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="User ID" source="userId" alwaysOn />
    <TextInput label="Name" source="name" alwaysOn />
    <TextInput label="Atname" source="atname" alwaysOn />
    <TextInput label="Referral Atname" source="referralAtname" alwaysOn />
  </Filter>
);

const StreamerList: React.FC = (props) => {
  return (
    <List {...props} filters={<StreamerFilter />}> 
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <TextField source="atname" />
        <BooleanField source="public" />
        <ReferenceField source="userId" reference="users">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="referralAtname" />
        <ShowButton />
        <EditButton />
      </Datagrid>
    </List>
  );
};

export default StreamerList;
