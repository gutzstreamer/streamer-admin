// GenderCreate.tsx
import {
  Create, SimpleForm, TextInput,
} from "react-admin";

export const GenderCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
