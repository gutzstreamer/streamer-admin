import { DefaultPagination } from "../common/DefaultPagination";
import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  TextInput,
  NumberInput,
  DateInput,
  SelectInput,
  ShowButton,
  EditButton,
  Filter,
  ReferenceField,
} from "react-admin";
import { statusChoices } from ".";
import { DatePresetInput } from "../common/DatePresetInput";

const WithdrawalFilter = (props: any) => (
  <Filter {...props}>
    <SelectInput
      label="Status"
      source="status"
      choices={statusChoices}
      alwaysOn
    />
    <DatePresetInput source="datePreset" label="Período" />
    <TextInput label="Pix Key" source="pixKey" />
    <TextInput label="Wallet ID" source="walletId" />
    <DateInput label="Criado após" source="createdAt_gte" />
    <DateInput label="Criado antes" source="createdAt_lte" />
    <NumberInput label="amount" source="amount" />
    <NumberInput label="fee" source="fee" />
    <TextInput label="finalAmount" source="finalAmount" />
    <TextInput label="id" source="id" />
    <TextInput label="name" source="name" />
    <TextInput label="pixKeyType" source="pixKeyType" />
    <TextInput label="streamerId" source="streamerId" />
    <DateInput label="updatedAt" source="updatedAt" />
  </Filter>
);

export const WithdrawalList = () => (
  <List perPage={25} pagination={<DefaultPagination />}
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
      <ReferenceField
        source="streamerId"
        reference="streamers"
        label="Streamer"
      >
        <TextField source="name" />
      </ReferenceField>
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





