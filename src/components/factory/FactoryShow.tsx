import {
  Show,
  SimpleShowLayout,
  TextField,
  ArrayField,
  Datagrid,
  NumberField,
  ReferenceField,
  DateField,
  UrlField,
  ImageField,
} from "react-admin";

export const FactoryShow: React.FC = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="ID" />
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

      <DateField source="createdAt" label="Data de Criação" />
      <DateField source="updatedAt" label="Última Atualização" />

      <ArrayField source="dimonaOrderStatus" label="Status na Dimona">
        <Datagrid rowClick={false}>
          <TextField source="id" label="ID" />
          <TextField source="status" label="Status" />
          <NumberField source="statusId" label="Status ID" />
          <DateField source="createdAt" label="Data de Criação" />
          <DateField source="updatedAt" label="Última Atualização" />
        </Datagrid>
      </ArrayField>

      <ArrayField source="items" label="Itens do Pedido">
        <Datagrid rowClick={false}>
          <TextField source="id" label="ID do Item" />
          <TextField source="name" label="Produto" />
          <TextField source="sku" label="SKU" />
          <NumberField source="qty" label="Quantidade" />
          <TextField source="dimonaSkuId" label="Dimona SKU ID" />
          <DateField source="createdAt" label="Data de Criação" />
          <DateField source="updatedAt" label="Última Atualização" />
          
          <ArrayField source="designs" label="Designs">
            <Datagrid rowClick={false}>
              <UrlField source="" label="Design URL" />
            </Datagrid>
          </ArrayField>
          
          <ArrayField source="mocks" label="Mockups">
            <Datagrid rowClick={false}>
              <UrlField source="" label="Mockup URL" />
            </Datagrid>
          </ArrayField>
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);
