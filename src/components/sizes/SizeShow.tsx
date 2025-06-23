// SizeShow.tsx
import {
  Show, SimpleShowLayout, TextField,
} from "react-admin";

export const SizeShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
    </SimpleShowLayout>
  </Show>
);
