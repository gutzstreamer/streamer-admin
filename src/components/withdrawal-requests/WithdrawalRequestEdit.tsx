import { Edit, SimpleForm, SelectInput, TextInput } from "react-admin";
import { statusChoices } from ".";

export const WithdrawalEdit = () => (
  <Edit>
    <SimpleForm>
      <SelectInput source="status" label="Status" choices={statusChoices} />
      <TextInput source="adminNote" label="Nota do Administrador" multiline />
    </SimpleForm>
  </Edit>
);
