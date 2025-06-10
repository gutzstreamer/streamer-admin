import {
  Edit,
  SimpleForm,
  ReferenceInput,
  SelectInput,
} from "react-admin";

export const UserSubscriptionEdit = () => (
  <Edit>
    <SimpleForm>
      <ReferenceInput source="planId" reference="subscription-plan">
        <SelectInput optionText="name" />
      </ReferenceInput>
      <SelectInput
        source="status"
        choices={[
          { id: "ACTIVE", name: "Active" },
          { id: "INACTIVE", name: "Inactive" },
          { id: "EXPIRED", name: "Expired" },
        ]}
      />
    </SimpleForm>
  </Edit>
);
