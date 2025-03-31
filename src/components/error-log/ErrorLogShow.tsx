import { Show, SimpleShowLayout, TextField, DateField } from "react-admin";

const ErrorLogShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="message" />
      <TextField source="stack" />
      <DateField source="createdAt" />
    </SimpleShowLayout>
  </Show>
);

export default ErrorLogShow;