import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
} from "react-admin";

export const WithdrawalShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <TextField source="walletId" label="Wallet ID" />
      <NumberField source="amount" label="Valor" />
      <TextField source="status" label="Status" />
      <TextField source="pixKey" label="Chave Pix" />
      <TextField source="pixKeyType" label="Tipo Pix" />
      <DateField source="processedAt" label="Processado em" />
      <TextField source="adminApprovedBy" label="Aprovado por" />
      <DateField source="adminApprovedAt" label="Data de aprovação" />
      <TextField source="adminNote" label="Nota Admin" />
      <TextField source="txId" label="Tx ID" />
      <DateField source="createdAt" label="Criado em" />
      <DateField source="updatedAt" label="Atualizado em" />
    </SimpleShowLayout>
  </Show>
);
