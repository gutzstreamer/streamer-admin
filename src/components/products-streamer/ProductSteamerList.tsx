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

const ProductStreamerFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Product Streamer ID" source="id" alwaysOn />
    <TextInput label="Streamer ID" source="streamerId" alwaysOn />
    <TextInput label="Product ID" source="productId" />
    <TextInput label="Name" source="name" />
    <TextInput label="Status" source="status" />
    <DatePresetInput source="datePreset" label="Período" />
    <DateInput label="Created After" source="createdAt_gte" />
    <DateInput label="Created Before" source="createdAt_lte" />
  </Filter>
);

const ProductStreamerList = (props: ListProps) => (
  <List
    perPage={25}
    pagination={<DefaultPagination />}
    {...props}
    filters={<ProductStreamerFilter />}
    sort={{ field: "createdAt", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField
        source="price"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <NumberField
        source="discountPrice"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="status" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
      <ReferenceField source="productId" reference="products">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="streamerId" reference="streamers">
        <TextField source="name" />
      </ReferenceField>
    </Datagrid>
  </List>
);

export default ProductStreamerList;





