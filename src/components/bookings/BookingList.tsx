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
  DateInput,
  ReferenceInput,
  AutocompleteInput,
  FunctionField,
} from 'react-admin';

const BookingFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput
      source="status"
      choices={[
        { id: 'PENDING', name: 'Pending' },
        { id: 'CONFIRMED', name: 'Confirmed' },
        { id: 'COMPLETED', name: 'Completed' },
        { id: 'CANCELLED', name: 'Cancelled' },
        { id: 'NO_SHOW', name: 'No Show' },
      ]}
    />
    <DateInput source="scheduledDate_gte" label="From Date" />
    <DateInput source="scheduledDate_lte" label="To Date" />
    <ReferenceInput source="orderId" reference="virtual-orders">
      <AutocompleteInput optionText="id" />
    </ReferenceInput>
  </Filter>
);

export const BookingList = () => (
  <List 
    filters={<BookingFilter />} 
    perPage={25}
    sort={{ field: 'scheduledDate', order: 'ASC' }}
  >
    <Datagrid rowClick="show">
      <TextField source="id" label="Booking ID" />
      <ReferenceField source="orderId" reference="virtual-orders" label="Order" link="show">
        <TextField source="id" />
      </ReferenceField>
      <FunctionField
        label="Product"
        render={(record: any) => (
          record.order?.product?.title || '—'
        )}
      />
      <FunctionField
        label="Buyer"
        render={(record: any) => (
          record.order?.buyer?.name || '—'
        )}
      />
      <FunctionField
        label="Streamer"
        render={(record: any) => (
          record.order?.streamer?.name || '—'
        )}
      />
      <DateField source="scheduledDate" label="Date" />
      <TextField source="scheduledTime" label="Time" />
      <FunctionField
        label="Duration"
        render={(record: any) => `${record.duration} min`}
      />
      <ChipField source="status" />
      <FunctionField
        label="Meeting Link"
        render={(record: any) => (
          record.meetingLink ? (
            <a href={record.meetingLink} target="_blank" rel="noopener noreferrer">
              🔗 Link
            </a>
          ) : (
            '—'
          )
        )}
      />
      <DateField source="createdAt" label="Booked At" showTime />
    </Datagrid>
  </List>
);
