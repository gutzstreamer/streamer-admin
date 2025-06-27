import {
  Edit,
  SimpleForm,
  SelectInput,
  TextInput,
} from "react-admin";

const statusChoices = [
  { id: "ACTIVE", name: "Aprovado" },
  { id: "REJECTED", name: "Rejeitado" },
  { id: "PENDING", name: "Pendente" },
  { id: "INACTIVE", name: "Inativo" },
];

const ProductStreamerEdit = () => (
  <Edit title="Atualizar status do produto streamer">
    <SimpleForm>
      <SelectInput source="status" label="Status" choices={statusChoices} />
      <TextInput source="reason" label="Motivo (opcional)" fullWidth />
    </SimpleForm>
  </Edit>
);

export default ProductStreamerEdit;
