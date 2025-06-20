import React from "react";
import {
  BooleanInput,
  Edit,
  SimpleForm,
  TextInput,
  useRecordContext,
} from "react-admin";
import { useWatch, useFormContext } from "react-hook-form";

const DisabledFields = () => {
  const { control } = useFormContext();
  const record = useRecordContext();
  const approved = useWatch({ name: "approved", control });

  const isApproved = record?.approved;

  return (
    <>
      <TextInput source="name" disabled={isApproved} />
      <TextInput source="email" disabled={isApproved} />
      <TextInput source="phone" disabled={isApproved} />
      <TextInput source="description" disabled={isApproved} />
      <BooleanInput source="approved" disabled={isApproved} />
    </>
  );
};

const StreamerRequestEdit: React.FC = () => (
  <Edit>
    <SimpleForm>
      <DisabledFields />
    </SimpleForm>
  </Edit>
);

export default StreamerRequestEdit;
