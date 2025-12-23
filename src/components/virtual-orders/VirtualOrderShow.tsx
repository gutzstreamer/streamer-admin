import {
  Show,
  TabbedShowLayout,
  Tab,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  ChipField,
  FunctionField,
  RichTextField,
  ArrayField,
  Datagrid,
  BooleanField,
} from 'react-admin';

export const VirtualOrderShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="Order Details">
        <TextField source="id" label="Order ID" />
        <ReferenceField source="productId" reference="virtual-products" label="Product">
          <TextField source="title" />
        </ReferenceField>
        <ChipField source="productType" label="Product Type" />
        <ReferenceField source="buyerId" reference="users" label="Buyer">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="buyerId" reference="users" label="Buyer Email">
          <TextField source="email" />
        </ReferenceField>
        <ReferenceField source="streamerId" reference="streamers" label="Streamer">
          <TextField source="name" />
        </ReferenceField>
        <NumberField source="quantity" />
        <ChipField source="status" />
        <TextField source="paymentId" label="Payment ID" />
        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </Tab>

      <Tab label="Financial">
        <NumberField
          source="totalAmount"
          label="Total Amount"
          options={{ style: 'currency', currency: 'BRL' }}
        />
        <NumberField
          source="fee"
          label="Platform Fee"
          options={{ style: 'currency', currency: 'BRL' }}
        />
        <NumberField
          source="netAmount"
          label="Net Amount (Streamer)"
          options={{ style: 'currency', currency: 'BRL' }}
        />
        <NumberField
          source="referCommissionValue"
          label="Refer Commission"
          options={{ style: 'currency', currency: 'BRL' }}
        />
        <NumberField
          source="referCommissionPercent"
          label="Refer Commission %"
          options={{ style: 'percent' }}
        />
        <TextField source="currency" />
        {/* <ReferenceField source="referId" reference="refers" label="Refer" emptyText="No refer">
          <TextField source="id" />
        </ReferenceField> */}
      </Tab>

      <Tab label="Type-Specific Data">
        <FunctionField
          label="Booking/Download/Key Details"
          render={(record: any) => {
            // SCHEDULED_ACTIVITY
            if (record.productType === 'SCHEDULED_ACTIVITY' && record.booking) {
              return (
                <div>
                  <h3>Booking Details</h3>
                  <p><strong>Scheduled Date:</strong> {new Date(record.booking.scheduledDate).toLocaleDateString()}</p>
                  <p><strong>Scheduled Time:</strong> {record.booking.scheduledTime}</p>
                  <p><strong>Duration:</strong> {record.booking.duration} minutes</p>
                  <p><strong>Meeting Link:</strong> {record.booking.meetingLink || 'Not set'}</p>
                  <p><strong>Meeting Password:</strong> {record.booking.meetingPassword || 'Not set'}</p>
                  <p><strong>Status:</strong> {record.booking.status}</p>
                  {record.booking.participantInfo && (
                    <div>
                      <h4>Participant Info:</h4>
                      <pre>{JSON.stringify(record.booking.participantInfo, null, 2)}</pre>
                    </div>
                  )}
                </div>
              );
            }

            // DIGITAL_DOWNLOAD
            if (record.productType === 'DIGITAL_DOWNLOAD' && record.downloadDelivery) {
              return (
                <div>
                  <h3>Download Details</h3>
                  <p><strong>Delivered:</strong> {record.downloadDelivery.delivered ? 'Yes' : 'No'}</p>
                  <p><strong>Download Count:</strong> {record.downloadDelivery.downloadCount}</p>
                  <p><strong>First Downloaded:</strong> {record.downloadDelivery.firstDownloadedAt ? new Date(record.downloadDelivery.firstDownloadedAt).toLocaleString() : 'Never'}</p>
                  <p><strong>Last Downloaded:</strong> {record.downloadDelivery.lastDownloadedAt ? new Date(record.downloadDelivery.lastDownloadedAt).toLocaleString() : 'Never'}</p>
                  {record.downloadDelivery.downloadConfig && (
                    <div>
                      <h4>File Info:</h4>
                      <p><strong>File URL:</strong> <a href={record.downloadDelivery.downloadConfig.fileUrl} target="_blank" rel="noopener noreferrer">Open</a></p>
                      <p><strong>Size:</strong> {record.downloadDelivery.downloadConfig.fileSizeMB} MB</p>
                    </div>
                  )}
                </div>
              );
            }

            // PRODUCT_KEY
            if (record.productType === 'PRODUCT_KEY' && record.keyDelivery) {
              return (
                <div>
                  <h3>Product Keys</h3>
                  <p><strong>Keys Delivered:</strong> {record.keyDelivery.keyValues?.length || 0}</p>
                  <div>
                    <h4>Keys:</h4>
                    <ul>
                      {record.keyDelivery.keyValues?.map((key: string, index: number) => (
                        <li key={index}><code>{key}</code></li>
                      ))}
                    </ul>
                  </div>
                  <p><strong>Sold At:</strong> {record.keyDelivery.soldAt ? new Date(record.keyDelivery.soldAt).toLocaleString() : 'Not sold'}</p>
                </div>
              );
            }

            return <p>No type-specific data available</p>;
          }}
        />
      </Tab>

      <Tab label="Reviews">
        <FunctionField
          label="Customer Review"
          render={(record: any) => 
            record.review ? (
              <div>
                <p><strong>Rating:</strong> {'⭐'.repeat(record.review.rating)}</p>
                <p><strong>Comment:</strong> {record.review.comment}</p>
                <p><strong>Created:</strong> {new Date(record.review.createdAt).toLocaleString()}</p>
              </div>
            ) : (
              <p>No review yet</p>
            )
          }
        />
      </Tab>
    </TabbedShowLayout>
  </Show>
);
