// ColorShow.tsx
import {
  Show, SimpleShowLayout, TextField,
} from "react-admin";

export const ColorShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="hex" />
    </SimpleShowLayout>
  </Show>
);
