import React from "react";
import {
  Datagrid,
  List,
  TextField,
  FunctionField,
} from "react-admin";

const FanPlanList: React.FC = (props) => (
  <List {...props} perPage={25}>
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
            : "—"
        }
      />
    </Datagrid>
  </List>
);

export default FanPlanList;
