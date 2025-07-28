import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  TextInput,
  DateInput,
  SelectInput,
  ShowButton,
  EditButton,
  Filter,
} from "react-admin";
import { statusChoices } from ".";

const WithdrawalFilter = (props: any) => (
  <Filter {...props}>
    <SelectInput
      label="Status"
      source="status"
      choices={statusChoices}
      alwaysOn
    />
    <TextInput label="Pix Key" source="pixKey" />
    <TextInput label="Wallet ID" source="walletId" />
    <DateInput label="Criado após" source="createdAt_gte" />
    <DateInput label="Criado antes" source="createdAt_lte" />
  </Filter>
);

export const WithdrawalList = () => (
  <List
    filters={<WithdrawalFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="ID" />
      <NumberField
        source="amount"
        label="Valor"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField source="fee" label="Taxa" />
      <NumberField
        source="finalAmount"
        label="Valor Final"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="status" label="Status" />
      <TextField source="pixKey" label="Chave Pix" />
      <TextField source="pixKeyType" label="Tipo Pix" />
      <DateField source="createdAt" label="Criado em" />
      <DateField source="updatedAt" label="Atualizado em" />
      <ShowButton />
      <EditButton />
    </Datagrid>
  </List>
);
