import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  ChipField,
  FunctionField,
} from "react-admin";

const WalletTransactionShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <ReferenceField source="walletId" reference="wallets">
        <TextField source="id" />
      </ReferenceField>
      <NumberField
        source="amount"
        options={{ style: "currency", currency: "BRL" }}
        locales="pt-BR"
      />
      <ChipField source="type" />
      <ChipField source="status" />
      <TextField source="description" />
      <ChipField source="originType" label="Origin Type" />
      <TextField source="originId" label="Origin ID" />
      <TextField source="txId" label="EFI Transaction ID" />
      <FunctionField
        label="Origin Info"
        render={(record: any) => {
          if (!record.originType || !record.originId) return "-";

          const originTypeMap: Record<string, string> = {
            WITHDRAWAL_REQUEST: "Withdrawal Request",
            DONATION: "Donation",
            ORDER_COMMISSION: "Order Commission",
            PIX_PAYMENT: "PIX Payment",
            MANUAL_ADJUSTMENT: "Manual Adjustment",
            REFUND: "Refund",
            UNKNOWN: "Unknown",
          };

          return `${originTypeMap[record.originType] || record.originType} (${record.originId})`;
        }}
      />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
    </SimpleShowLayout>
  </Show>
);

export default WalletTransactionShow;
