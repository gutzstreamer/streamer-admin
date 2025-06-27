import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  DateField,
  Filter,
  TextInput,
} from "react-admin";
import { ListProps } from "react-admin";

const ProductStreamerFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Streamer ID" source="streamerId" alwaysOn />
  </Filter>
);

const ProductStreamerList = (props: ListProps) => (
  <List {...props} filters={<ProductStreamerFilter />}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="price" />
      <NumberField source="discountPrice" />
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
