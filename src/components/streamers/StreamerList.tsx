import { List, Datagrid, TextField, ReferenceField, EditButton, ShowButton } from 'react-admin';

const StreamerList: React.FC = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
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
