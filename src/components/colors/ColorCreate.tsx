// ColorCreate.tsx
import {
  Create, SimpleForm, TextInput,
} from "react-admin";

export const ColorCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="hex" />
    </SimpleForm>
  </Create>
);
