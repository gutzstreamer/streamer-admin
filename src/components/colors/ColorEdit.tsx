// ColorEdit.tsx
import {
  Edit, SimpleForm, TextInput,
} from "react-admin";

export const ColorEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
      <TextInput source="hex" />
    </SimpleForm>
  </Edit>
);
