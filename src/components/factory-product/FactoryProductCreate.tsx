import {
  Create,
  SimpleForm,
  TextInput,
  required,
} from 'react-admin';

const FactoryProductCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" validate={required()} />
    </SimpleForm>
  </Create>
);

export default FactoryProductCreate;
