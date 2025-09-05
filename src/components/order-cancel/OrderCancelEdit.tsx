import { Edit, SimpleForm, SelectInput, TextInput } from "react-admin";
import { orderCancelStatusChoices } from ".";

export const OrderCancelEdit = () => (
  <Edit>
    <SimpleForm>
      <SelectInput
        source="status"
        label="Status"
        choices={orderCancelStatusChoices}
      />
      <TextInput source="adminNote" label="Nota do Admin" multiline />
    </SimpleForm>
  </Edit>
);
