// GenderEdit.tsx
import {
  Edit, SimpleForm, TextInput,
} from "react-admin";

export const GenderEdit = () => (
  <Edit>
    <SimpleForm>
      <TextInput source="name" />
    </SimpleForm>
  </Edit>
);
