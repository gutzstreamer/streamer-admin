import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  ChipField,
  ImageField,
  NumberField,
  DateField,
} from "react-admin";

export const OrderBillingShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" label="ID da Cobrança" />
      <ReferenceField
        source="orderId"
        reference="orders"
        label="Pedido"
        link="show"
      >
        <ChipField source="id" />
      </ReferenceField>
      <TextField source="status" label="Status" />
      <TextField source="code" label="Código" />
      <ImageField source="qrCode" label="QR Code" />
      <TextField source="pixCode" label="Código PIX" />
      <NumberField
        source="amount"
        label="Valor "
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <TextField source="type" label="Tipo" />
      <DateField source="createdAt" label="Criado em" />
      <DateField source="updatedAt" label="Atualizado em" />
    </SimpleShowLayout>
  </Show>
);
