import { List, Datagrid, TextField, ReferenceField } from 'react-admin';

const StreamerList: React.FC = (props) => {
  return (
    <List {...props}>
      <Datagrid>
        <TextField source="id" />
        <TextField source="name" />
        <ReferenceField source="userId" reference="users">
          <TextField source="name" />
        </ReferenceField>
        <TextField source="bio" />
      </Datagrid>
    </List>
  );
};

export default StreamerList;