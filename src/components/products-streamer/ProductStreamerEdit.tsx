import {
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  useNotify,
  useRedirect,
  useDataProvider,
  Toolbar,
  SaveButton,
  useRecordContext,
} from "react-admin";

const statusChoices = [
  { id: "ACTIVE", name: "Ativo" },
  { id: "INACTIVE", name: "Inativo" },
  { id: "REJECTED", name: "Rejeitado" },
];

const CustomToolbar = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const handleSave = async () => {
    try {
      await dataProvider.approveProductStreamer("product-streamers", {
        id: record?.id,
        data: {
          status: record?.status,
          reason: record?.reason || "",
        },
      });

      notify("Status atualizado com sucesso!", { type: "success" });
      redirect("/product-streamers");
    } catch (error) {
      notify("Erro ao atualizar status", { type: "error" });
    }
  };

  return <SaveButton label="Salvar aprovação" onClick={handleSave} />;
};

const ProductStreamerEdit = () => (
  <Edit title="Aprovar Produto Streamer">
    <SimpleForm toolbar={<CustomToolbar />}>
      <TextInput source="id" disabled />
      <SelectInput source="status" choices={statusChoices} label="Status" />
      <TextInput
        source="reason"
        label="Motivo (se rejeitado)"
        fullWidth
        multiline
      />
    </SimpleForm>
  </Edit>
);

export default ProductStreamerEdit;
