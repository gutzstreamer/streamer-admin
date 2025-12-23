import {
  List,
  Datagrid,
  TextField,
  DateField,
  ReferenceField,
  ChipField,
  Filter,
  TextInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
  FunctionField,
  BulkDeleteButton,
} from 'react-admin';

const ProductKeyFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'AVAILABLE', name: 'Available' },
        { id: 'SOLD', name: 'Sold' },
        { id: 'RESERVED', name: 'Reserved' },
      ]}
    />
    <ReferenceInput source="configId" reference="virtual-products" label="Product">
      <AutocompleteInput optionText="title" />
    </ReferenceInput>
  </Filter>
);

const BulkActionButtons = () => (
  <>
    <BulkDeleteButton />
  </>
);

export const ProductKeyList = () => (
  <List 
    filters={<ProductKeyFilter />} 
    perPage={50}
    sort={{ field: 'createdAt', order: 'DESC' }}
  >
    <Datagrid 
      rowClick="show"
      bulkActionButtons={<BulkActionButtons />}
    >
      <TextField source="id" label="Key ID" />
      <ReferenceField source="configId" reference="virtual-product-key-configs" label="Product Config" link={false}>
        <TextField source="id" />
      </ReferenceField>
      <FunctionField
        label="Key Value(s)"
        render={(record: any) => (
          <span>
            {record.keyValues && record.keyValues.length > 0 ? (
              <>
                <code>{record.keyValues[0]}</code>
                {record.keyValues.length > 1 && ` (+${record.keyValues.length - 1} more)`}
              </>
            ) : (
              'No keys'
            )}
          </span>
        )}
      />
      <ChipField source="status" label="Status" />
      <ReferenceField source="orderId" reference="virtual-orders" label="Order" emptyText="Not sold" link="show">
        <TextField source="id" />
      </ReferenceField>
      <DateField source="soldAt" label="Sold At" showTime emptyText="—" />
      <DateField source="createdAt" label="Created" showTime />
    </Datagrid>
  </List>
);
