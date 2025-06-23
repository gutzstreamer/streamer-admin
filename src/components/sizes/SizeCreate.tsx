// SizeCreate.tsx
import {
  Create, SimpleForm, TextInput,
} from "react-admin";

export const SizeCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Create>
);
