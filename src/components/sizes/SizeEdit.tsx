// SizeEdit.tsx
import {
  Edit, SimpleForm, TextInput,
} from "react-admin";

export const SizeEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
