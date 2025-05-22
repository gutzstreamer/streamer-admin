import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  Datagrid,
  NumberField,
  ReferenceField,
} from "react-admin";

export const FactoryShow: React.FC = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="dimonaOrderId" label="ID do Pedido Dimona" />

      <ReferenceField source="orderId" reference="orders" label="Pedido">
        <TextField source="id" />
      </ReferenceField>

      <ReferenceField
        source="orderNfeId"
        reference="invoices"
        label="Nota Fiscal"
      >
        <TextField source="id" />
      </ReferenceField>

      <ReferenceField source="addressId" reference="address" label="Endereço">
        <TextField source="id" />
      </ReferenceField>

      <TextField source="deliveryMethodId" label="Método de Entrega" />
      <TextField source="shippingSpeed" label="Prazo de Entrega" />

      <TextField source="customerName" label="Nome do Cliente" />
      <TextField source="customerDocument" label="Documento do Cliente" />
      <TextField source="customerEmail" label="Email do Cliente" />

      <ArrayField source="dimonaOrderStatus" label="Status na Dimona">
        <Datagrid>
          <TextField source="status" label="Status" />
          <TextField source="date" label="Data" />
        </Datagrid>
      </ArrayField>

      <ArrayField source="items" label="Itens do Pedido">
        <Datagrid>
          <TextField source="name" label="Produto" />
          <TextField source="sku" label="SKU" />
          <NumberField source="qty" label="Quantidade" />
          <TextField source="dimonaSkuId" label="Dimona SKU ID" />
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
