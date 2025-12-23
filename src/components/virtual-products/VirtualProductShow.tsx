import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ReferenceField,
  FunctionField,
  ChipField,
  BooleanField,
  ArrayField,
  Datagrid,
  TabbedShowLayout,
  Tab,
  RichTextField,
} from 'react-admin';

export const VirtualProductShow = () => (
  <Show>
    <TabbedShowLayout>
      <Tab label="General">
        <TextField source="id" />
        <TextField source="title" />
        <RichTextField source="shortDescription" />
        <RichTextField source="fullDescription" />
        <ChipField source="type" />
        <ChipField source="status" />
        <FunctionField
          label="Category"
          render={(record: any) => {
            const categories: { [key: string]: string } = {
              MENTORSHIP: 'Mentorship',
              CONSULTING: 'Consulting',
              WORKSHOP: 'Workshop',
              COURSE: 'Course',
              EBOOK: 'E-book',
              TEMPLATE: 'Template',
              SOFTWARE: 'Software',
              GAME: 'Game',
              OTHER: 'Other',
            };
            return categories[record.category] || record.category;
          }}
        />
        <ReferenceField source="streamerId" reference="streamers" label="Streamer">
          <TextField source="name" />
        </ReferenceField>
        <NumberField
          source="price"
          options={{ style: 'currency', currency: 'BRL' }}
        />
        <TextField source="currency" />
        <NumberField source="salesCount" label="Total Sales" />
        <DateField source="createdAt" showTime />
        <DateField source="updatedAt" showTime />
      </Tab>

      <Tab label="Configuration">
        <FunctionField
          label="Type Config"
          render={(record: any) => {
            if (record.type === 'SCHEDULED_ACTIVITY' && record.scheduleConfig) {
              return (
                <div>
                  <p><strong>Duration:</strong> {record.scheduleConfig.durationMinutes} minutes</p>
                  <p><strong>Max Participants:</strong> {record.scheduleConfig.maxParticipants}</p>
                  <p><strong>Allow Cancellation:</strong> {record.scheduleConfig.allowCancellation ? 'Yes' : 'No'}</p>
                  <p><strong>Allow Reschedule:</strong> {record.scheduleConfig.allowReschedule ? 'Yes' : 'No'}</p>
                </div>
              );
            }
            if (record.type === 'DIGITAL_DOWNLOAD' && record.downloadConfig) {
              return (
                <div>
                  <p><strong>File URL:</strong> {record.downloadConfig.fileUrl}</p>
                  <p><strong>File Size:</strong> {record.downloadConfig.fileSizeMB} MB</p>
                  <p><strong>Stock:</strong> {record.downloadConfig.stockQuantity || 'Unlimited'}</p>
                  {record.downloadConfig.saleEndsAt && (
                    <p><strong>Sale Ends:</strong> {new Date(record.downloadConfig.saleEndsAt).toLocaleString()}</p>
                  )}
                </div>
              );
            }
            if (record.type === 'PRODUCT_KEY' && record.keyConfig) {
              return (
                <div>
                  <p><strong>Platform:</strong> {record.keyConfig.platform}</p>
                  <p><strong>Region:</strong> {record.keyConfig.region}</p>
                  <p><strong>Delivery Type:</strong> {record.keyConfig.deliveryType}</p>
                  {record.keyConfig.saleEndsAt && (
                    <p><strong>Sale Ends:</strong> {new Date(record.keyConfig.saleEndsAt).toLocaleString()}</p>
                  )}
                </div>
              );
            }
            return <p>No configuration found</p>;
          }}
        />
      </Tab>

      <Tab label="Images & Media">
        <FunctionField
          label="Cover Image"
          render={(record: any) => 
            record.coverImage ? (
              <img src={record.coverImage} alt="Cover" style={{ maxWidth: '300px' }} />
            ) : (
              <p>No cover image</p>
            )
          }
        />
        <ArrayField source="galleryImages" label="Gallery">
          <Datagrid bulkActionButtons={false}>
            <FunctionField
              label="Image"
              render={(record: any) => (
                <img src={record} alt="Gallery" style={{ maxWidth: '100px' }} />
              )}
            />
          </Datagrid>
        </ArrayField>
      </Tab>

      <Tab label="Tags">
        <ArrayField source="tags">
          <Datagrid bulkActionButtons={false}>
            <TextField source="." />
          </Datagrid>
        </ArrayField>
      </Tab>
    </TabbedShowLayout>
  </Show>
);
