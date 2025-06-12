import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
} from "react-admin";

export const WithdrawalShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
      <NumberField source="amount" label="Valor" />
      <NumberField source="fee" label="Taxa" />
      <NumberField source="finalAmount" label="Valor Final" />
      <TextField source="status" label="Status" />
      <TextField source="pixKey" label="Chave Pix" />
      <TextField source="pixKeyType" label="Tipo Pix" />
      <DateField source="processedAt" label="Processado em" />
      <ReferenceField source="walletId" label="Wallet" reference="wallets">
        <TextField source="id" />
      </ReferenceField>
      <ReferenceField
        source="adminApprovedBy"
        label="User Admin"
        reference="users"
      >
        <TextField source="name" />
      </ReferenceField>
      <DateField source="adminApprovedAt" label="Data de aprovação" />
      <TextField source="adminNote" label="Nota Admin" />
      <TextField source="txId" label="Tx ID" />
      <DateField source="createdAt" label="Criado em" />
      <DateField source="updatedAt" label="Atualizado em" />
    </SimpleShowLayout>
  </Show>
);
