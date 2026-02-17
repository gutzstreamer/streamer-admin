import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  DateField,
  DateInput,
  Filter,
  TextInput,
  SelectInput,
} from "react-admin";
import { ListProps } from "react-admin";
import { DatePresetInput } from "../common/DatePresetInput";

const WalletFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="User ID" source="userId" alwaysOn />
    <SelectInput 
      label="Type" 
      source="type" 
      choices={[
        { id: 'market', name: 'Market' },
        { id: 'donate', name: 'Donate' },
      ]} 
    />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Updated After" source="updatedAt_gte" />
    <DateInput label="Updated Before" source="updatedAt_lte" />
  </Filter>
);

const WalletList = (props: ListProps) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<WalletFilter />}
    sort={{ field: "updatedAt", order: "DESC" }}
  >
    <Datagrid>
      <TextField source="id" />
      <TextField source="pixKey" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <NumberField
        source="balance"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField
        source="pendingBalance"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="type" />
      <TextField source="currency" />
      <TextField source="status" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </Datagrid>
  </List>
);

export default WalletList;





