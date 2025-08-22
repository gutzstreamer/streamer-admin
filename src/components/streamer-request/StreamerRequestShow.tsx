import React from "react";
import {
  ArrayField,
  BooleanField,
  ChipField,
  DateField,
  ReferenceField,
  Show,
  ShowActionsProps,
  ShowProps,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
  TopToolbar,
  EditButton,
  useRecordContext,
} from "react-admin";

const ConditionalShowActions: React.FC<ShowActionsProps> = () => {
  const record = useRecordContext();

  if (!record) return null;

  const { approved, status } = record;

  if (approved === false && status === "REJECTED") {
    return null;
  }

  return (
    <TopToolbar>
      <EditButton />
    </TopToolbar>
  );
};

const SteamerRequestShow: React.FC<ShowProps> = (props) => (
  <Show actions={<ConditionalShowActions />} {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="atname" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="description" />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <TextField source="status" />
      <TextField source="reason" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <BooleanField source="approved" />
      <ArrayField source="links">
        <SingleFieldList linkType={false}>
          <ChipField source="url" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default SteamerRequestShow;
