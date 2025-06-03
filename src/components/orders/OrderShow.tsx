import React from "react";
import {
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ArrayField,
  ReferenceField,
  SimpleShowLayout,
  Show,
  ImageField,
  ChipField,
} from "react-admin";
import OrderShowActions from "./OrderShowActions";

const OrderShow: React.FC = (props) => (
  <Show {...props} actions={<OrderShowActions /> }>
    <SimpleShowLayout>
      <TextField source="id" label="ID do Pedido" />
      <ReferenceField
        source="userId"
        reference="users"
        label="Usuário"
        link="show"
      >
        <TextField source="name" />
      </ReferenceField>
      <TextField source="paymentType" label="Tipo de Pagamento" />
      <TextField source="shippingSpeed" label="Velocidade de Envio" />
      <TextField source="deliveryMethodId" label="ID do Método de Entrega" />
      <NumberField source="businessDays" label="Dias Úteis" />
      <TextField source="paymentToken" label="Token de Pagamento" />
      <NumberField source="installments" label="Parcelas" />
      <NumberField source="totalAmountDiscount" label="Desconto Total" />
      <NumberField source="totalAmountShipping" label="Frete Total" />
      <NumberField
        source="totalAmountProducts"
        label="Valor Total dos Produtos"
      />
      <NumberField source="totalAmount" label="Valor Total" />
      <DateField source="createdAt" label="Criado em" />
      <DateField source="updatedAt" label="Atualizado em" />

      <h3>Produtos do Pedido</h3>
      <ArrayField source="orderProducts" label="Produtos">
        <Datagrid rowClick={false}>
          <ReferenceField
            source="productStreamerId"
            reference="product-streamer"
            label="Produto Streamer"
            link="show"
          >
            <TextField source="name" />
          </ReferenceField>
          <NumberField source="quantity" label="Quantidade" />
          <TextField source="color" label="Cor" />
          <TextField source="size" label="Tamanho" />
          <NumberField source="price" label="Preço" />
          <ImageField source="image" label="Imagem" />
        </Datagrid>
      </ArrayField>

      <h3>Status do Pedido</h3>
      <ArrayField source="orderStatus" label="Status">
        <Datagrid rowClick={false}>
          <TextField source="id" label="ID do Status" />
          <TextField source="name" label="Nome do Status" />
          <DateField source="createdAt" label="Criado em" />
          <DateField source="updatedAt" label="Atualizado em" />
        </Datagrid>
      </ArrayField>

      <h3>Endereço de Entrega</h3>
      <ReferenceField
        source="addressId"
        reference="address"
        label="Endereço"
        link="show"
      >
        <ChipField source="nickname" />
      </ReferenceField>

      <h3>Cobrança</h3>
      <ReferenceField
        source="billing.id"
        reference="order-billings"
        label="Cobrança"
        link="show"
      >
        <ChipField source="status" />
      </ReferenceField>

      <h3>Nota Fiscal</h3>
      <ReferenceField
        source="invoice.id"
        reference="invoices"
        label="Nota Fiscal"
        link="show"
      >
        <ChipField source="accessKey" />
      </ReferenceField>
    </SimpleShowLayout>
  </Show>
);

export default OrderShow;
