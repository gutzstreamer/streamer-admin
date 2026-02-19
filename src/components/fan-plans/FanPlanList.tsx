import { DefaultPagination } from "../common/DefaultPagination";
import React from "react";
import { Datagrid, List, TextField, FunctionField, Filter, TextInput } from "react-admin";

const FanPlanFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Plan ID" source="id" alwaysOn />
    <TextInput label="Streamer ID" source="streamerId" />
    <TextInput label="Tier" source="tier" />
    <TextInput label="Name" source="name" />
    <TextInput label="Status" source="status" />
    <TextInput label="currency" source="currency" />
    <TextInput label="interval" source="interval" />
  </Filter>
);

const FanPlanList: React.FC = (props) => (
  <List
    pagination={<DefaultPagination />}
    {...props}
    perPage={25}
    filters={<FanPlanFilter />}
    sort={{ field: "id", order: "DESC" }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="streamerId" label="Streamer" />
      <TextField source="tier" />
      <TextField source="name" />
      <TextField source="status" />
      <TextField source="interval" />
      <TextField source="currency" />
      <FunctionField
        label="Price"
        render={(record: any) =>
          record?.versions?.[0]
            ? (record.versions[0].priceCents / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: record.currency || "BRL",
              })
            : "â€”"
        }
      />
    </Datagrid>
  </List>
);

export default FanPlanList;


