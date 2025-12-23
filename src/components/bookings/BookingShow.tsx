import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  DateField,
  ReferenceField,
  ChipField,
  FunctionField,
  BooleanField,
} from 'react-admin';

export const BookingShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Booking Info">
        <TextField source="id" label="Booking ID" />
        <ReferenceField source="orderId" reference="virtual-orders" label="Order" link="show">
          <TextField source="id" />
        </ReferenceField>
        <FunctionField
          label="Product"
          render={(record: any) => record.order?.product?.title || '—'}
        />
        <FunctionField
          label="Buyer"
          render={(record: any) => record.order?.buyer?.name || '—'}
        />
        <FunctionField
          label="Buyer Email"
          render={(record: any) => record.order?.buyer?.email || '—'}
        />
        <FunctionField
          label="Streamer"
          render={(record: any) => record.order?.streamer?.name || '—'}
        />
        <ChipField source="status" />
        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </Tab>

      <Tab label="Schedule">
        <DateField source="scheduledDate" label="Scheduled Date" />
        <TextField source="scheduledTime" label="Scheduled Time" />
        <FunctionField
          label="Duration"
          render={(record: any) => `${record.duration} minutes`}
        />
        <ReferenceField source="slotId" reference="virtual-product-slots" label="Slot" emptyText="No slot assigned" link={false}>
          <TextField source="id" />
        </ReferenceField>
        <TextField source="meetingLink" label="Meeting Link" />
        <TextField source="meetingPassword" label="Meeting Password" />
        <TextField source="additionalInstructions" label="Additional Instructions" />
      </Tab>

      <Tab label="Participant Info">
        <FunctionField
          label="Participant Information"
          render={(record: any) => (
            record.participantInfo ? (
              <pre style={{ 
                background: '#f4f4f4', 
                padding: '12px', 
                borderRadius: '4px',
                overflow: 'auto'
              }}>
                {JSON.stringify(record.participantInfo, null, 2)}
              </pre>
            ) : (
              <p>No participant information provided</p>
            )
          )}
        />
      </Tab>

      <Tab label="Cancellation Policy">
        <FunctionField
          label="Policy Details"
          render={(record: any) => {
            const policy = record.cancellationPolicy;
            if (!policy) return <p>No cancellation policy</p>;
            
            return (
              <div>
                <p><strong>Allow Cancellation:</strong> {policy.allowCancellation ? 'Yes' : 'No'}</p>
                {policy.allowCancellation && (
                  <>
                    <p><strong>Full Refund (hours before):</strong> {policy.fullRefundHours}</p>
                    <p><strong>Partial Refund (hours before):</strong> {policy.partialRefundHours}</p>
                    <p><strong>Partial Refund Percentage:</strong> {policy.partialRefundPercentage}%</p>
                  </>
                )}
                <p><strong>Allow Reschedule:</strong> {policy.allowReschedule ? 'Yes' : 'No'}</p>
                {policy.allowReschedule && (
                  <>
                    <p><strong>Reschedule Deadline (hours before):</strong> {policy.rescheduleDeadlineHours}</p>
                    <p><strong>Max Reschedules:</strong> {policy.maxReschedules}</p>
                    <p><strong>Reschedule Count:</strong> {record.rescheduleCount}</p>
                  </>
                )}
              </div>
            );
          }}
        />
      </Tab>

      <Tab label="Cancellation">
        <TextField source="cancellationReason" label="Cancellation Reason" emptyText="Not cancelled" />
        <TextField source="cancelledBy" label="Cancelled By" emptyText="—" />
        <DateField source="cancelledAt" label="Cancelled At" showTime emptyText="—" />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
