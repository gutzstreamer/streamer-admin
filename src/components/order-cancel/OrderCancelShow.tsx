import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  DateField,
} from "react-admin";

export const OrderCancelShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID do Cancelamento" />
      <ReferenceField source="orderId" reference="orders" label="Pedido">
        <TextField source="id" label="ID do Pedido" />
      </ReferenceField>
      <TextField source="reason" label="Motivo" />
      <TextField source="status" label="Status" />
      <ReferenceField source="adminId" label="User Admin" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <DateField source="adminActionAt" label="Data de aprovação" />
      <TextField source="adminNote" label="Nota Admin" />
      <DateField source="createdAt" label="Criado em" />
      <DateField source="updatedAt" label="Atualizado em" />
    </SimpleShowLayout>
  </Show>
);
