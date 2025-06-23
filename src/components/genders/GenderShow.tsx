// GenderShow.tsx
import {
  Show, SimpleShowLayout, TextField, DateField,
} from "react-admin";

export const GenderShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);
