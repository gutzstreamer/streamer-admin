import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  ChipField,
  Filter,
  TextInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  FunctionField,
} from 'react-admin';

const VirtualOrderFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search Order ID" source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'PENDING_PAYMENT', name: 'Pending Payment' },
        { id: 'PENDING_CONFIRMATION', name: 'Pending Confirmation' },
        { id: 'CONFIRMED', name: 'Confirmed' },
        { id: 'COMPLETED', name: 'Completed' },
        { id: 'CANCELLED', name: 'Cancelled' },
      ]}
    />
    <SelectInput
      source="productType"
      label="Product Type"
      choices={[
        { id: 'SCHEDULED_ACTIVITY', name: 'Scheduled Activity' },
        { id: 'DIGITAL_DOWNLOAD', name: 'Digital Download' },
        { id: 'PRODUCT_KEY', name: 'Product Key' },
      ]}
    />
    <ReferenceInput source="streamerId" reference="streamers">
      <AutocompleteInput optionText="name" />
    </ReferenceInput>
    <ReferenceInput source="buyerId" reference="users">
      <AutocompleteInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

export const VirtualOrderList = () => (
  <List filters={<VirtualOrderFilter />} perPage={25} sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="show">
      <TextField source="id" label="Order ID" />
      <ReferenceField source="productId" reference="virtual-products" label="Product">
        <TextField source="title" />
      </ReferenceField>
      <ChipField source="productType" label="Type" />
      <ReferenceField source="buyerId" reference="users" label="Buyer">
        <TextField source="name" />
      </ReferenceField>
      <ReferenceField source="streamerId" reference="streamers" label="Streamer">
        <TextField source="name" />
      </ReferenceField>
      <NumberField source="quantity" />
      <NumberField
        source="totalAmount"
        label="Total"
        options={{ style: 'currency', currency: 'BRL' }}
      />
      <NumberField
        source="netAmount"
        label="Net (Streamer)"
        options={{ style: 'currency', currency: 'BRL' }}
      />
      <ChipField source="status" label="Status" />
      <FunctionField
        label="Payment"
        render={(record: any) => (
          <span>
            {record.paymentId ? `✓ ${record.paymentId.substring(0, 8)}...` : '✗ No payment'}
          </span>
        )}
      />
      <DateField source="createdAt" label="Created" showTime />
    </Datagrid>
  </List>
);
