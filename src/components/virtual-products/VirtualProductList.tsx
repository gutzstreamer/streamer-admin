import {
  List,
  Datagrid,
  TextField,
  DateField,
  NumberField,
  SelectField,
  ReferenceField,
  FunctionField,
  ChipField,
  BooleanField,
  Filter,
  TextInput,
  SelectInput,
  ReferenceInput,
  AutocompleteInput,
} from 'react-admin';

const VirtualProductFilter = (props: any) => (
  <Filter {...props}>
    <TextInput label="Search" source="q" alwaysOn />
    <SelectInput
      source="type"
      choices={[
        { id: 'SCHEDULED_ACTIVITY', name: 'Scheduled Activity' },
        { id: 'DIGITAL_DOWNLOAD', name: 'Digital Download' },
        { id: 'PRODUCT_KEY', name: 'Product Key' },
      ]}
    />
    <SelectInput
      source="status"
      choices={[
        { id: 'ACTIVE', name: 'Active' },
        { id: 'INACTIVE', name: 'Inactive' },
        { id: 'DRAFT', name: 'Draft' },
      ]}
    />
    <ReferenceInput source="streamerId" reference="streamers">
      <AutocompleteInput optionText="name" />
    </ReferenceInput>
  </Filter>
);

export const VirtualProductList = () => (
  <List filters={<VirtualProductFilter />} perPage={25}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="title" label="Title" />
      <ChipField source="type" label="Type" />
      <ReferenceField source="streamerId" reference="streamers" label="Streamer">
        <TextField source="name" />
      </ReferenceField>
      <NumberField
        source="price"
        label="Price"
        options={{ style: 'currency', currency: 'BRL' }}
      />
      <ChipField source="status" label="Status" />
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
      <NumberField source="salesCount" label="Sales" />
      <DateField source="createdAt" label="Created" showTime />
    </Datagrid>
  </List>
);
