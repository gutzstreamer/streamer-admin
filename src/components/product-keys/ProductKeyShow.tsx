import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  ReferenceField,
  ChipField,
  FunctionField,
  ArrayField,
  Datagrid,
} from 'react-admin';

export const ProductKeyShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" label="Key ID" />
      <ReferenceField source="configId" reference="virtual-product-key-configs" label="Config">
        <TextField source="id" />
      </ReferenceField>
      <ChipField source="status" />
      <ReferenceField source="orderId" reference="virtual-orders" label="Sold to Order" emptyText="Not sold yet" link="show">
        <TextField source="id" />
      </ReferenceField>
      <DateField source="soldAt" showTime emptyText="Not sold" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      
      <FunctionField
        label="Key Values"
        render={(record: any) => (
          <div>
            {record.keyValues && record.keyValues.length > 0 ? (
              <ul>
                {record.keyValues.map((key: string, index: number) => (
                  <li key={index}>
                    <code style={{ 
                      background: '#f4f4f4', 
                      padding: '4px 8px', 
                      borderRadius: '4px',
                      fontFamily: 'monospace'
                    }}>
                      {key}
                    </code>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No keys available</p>
            )}
          </div>
        )}
      />
    </SimpleShowLayout>
  </Show>
);
