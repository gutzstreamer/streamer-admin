import React from "react";
import {
  ArrayField,
  BooleanField,
  Button,
  ChipField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TopToolbar,
  useDataProvider,
  useNotify,
  useRecordContext,
} from "react-admin";
import ImageField from "../common/ImageField";
import RefreshIcon from "@mui/icons-material/Refresh";

const ReloadAlertPageButton: React.FC = () => {
  const record = useRecordContext();
  const dataProvider = useDataProvider();
  const notify = useNotify();
  const [loading, setLoading] = React.useState(false);

  const handleReloadAlertPage = async () => {
    if (!record?.id) return;

    try {
      setLoading(true);
      await dataProvider.getOne(`streamers/${record.id}/reload-page`, { id: "" });
      notify("Página de alerta recarregada com sucesso!", { type: "success" });
    } catch (error: any) {
      notify(error?.message || "Erro ao recarregar página de alerta", { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      label="Recarregar Página de Alerta"
      onClick={handleReloadAlertPage}
      disabled={loading}
    >
      <RefreshIcon />
    </Button>
  );
};

const StreamerShowActions = () => (
  <TopToolbar>
    <ReloadAlertPageButton />
  </TopToolbar>
);

const StreamerShow: React.FC = (props) => (
  <Show {...props} actions={<StreamerShowActions />}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="atname" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="bio" />
      <ImageField source="image" label="Profile Image" width={150} height={150} />
      <BooleanField source="public" />
      <ArrayField source="games">
        <SingleFieldList linkType={false}>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="links">
        <SingleFieldList linkType={false}>
          <ChipField source="url" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default StreamerShow;