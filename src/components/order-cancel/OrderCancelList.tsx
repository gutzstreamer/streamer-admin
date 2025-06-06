import {
  Filter,
  TextInput,
  SelectInput,
  DateInput,
  Datagrid,
  DateField,
  EditButton,
  List,
  ShowButton,
  TextField,
  ReferenceField,
} from "react-admin";
import { orderCancelStatusChoices } from ".";

const OrderCancelFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="ID do Pedido" source="orderId" alwaysOn />
    <TextInput label="ID do Cancelamento" source="id" />
    <SelectInput
      label="Status"
      source="status"
      choices={orderCancelStatusChoices}
      alwaysOn
    />
    <DateInput label="Criado após" source="createdAt_gte" />
    <DateInput label="Criado antes" source="createdAt_lte" />
  </Filter>
);

export const OrderCancelList = () => (
  <List
    filters={<OrderCancelFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID do Cancelamento" />
      <ReferenceField source="orderId" reference="orders" label="Pedido">
        <TextField source="id" label="ID do Pedido" />
      </ReferenceField>
      <TextField source="status" label="Status" />
      <TextField source="reason" label="Motivo" />
      <DateField source="createdAt" label="Criado em" />
      <DateField source="updatedAt" label="Atualizado em" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);

// {
//     "id": "fe8ff69a-4cd4-4865-b5f3-d4f401473cb3",
//     "orderId": "cmbl37r9u0000109bexbukuc2",
//     "reason": "Não foi possível gerar a nota fiscal",
//     "status": "PENDING",
//     "adminId": null,
//     "adminActionAt": null,
//     "adminNote": null,
//     "createdAt": "2025-06-06T19:21:59.014Z",
//     "updatedAt": "2025-06-06T19:21:59.014Z"
// }
