import {
  Edit,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';

const FactoryProductEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="id" disabled />
      <TextInput source="name" validate={required()} />
    </SimpleForm>
  </Edit>
);

export default FactoryProductEdit;
