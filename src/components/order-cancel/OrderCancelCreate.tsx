import { Create, SimpleForm, TextInput } from "react-admin";

export const OrderCancelCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="reason" label="Motivo do Cancelamento" multiline />
      <TextInput source="orderId" label="ID do Pedido" />
    </SimpleForm>
  </Create>
);
