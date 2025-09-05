import {
  Show,
  SimpleShowLayout,
  TextField,
  BooleanField,
  ArrayField,
  Datagrid,
  ReferenceField,
} from "react-admin";

const UserShow = (props: any) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="identityNumber" />
      <BooleanField source="active" />
      <BooleanField source="blocked" />

      <ReferenceField
        source="subscription.id"
        reference="subscription"
        label="Subscription"
      >
        <TextField source="id" />
      </ReferenceField>

      <ReferenceField
        source="subscription.planId"
        reference="subscription-plan"
        label="Plan Name"
      >
        <TextField source="name" />
      </ReferenceField>

      {/* Wallets - array */}
      <ArrayField source="wallets" label="Wallets">
        <Datagrid>
          <ReferenceField source="id" reference="wallets">
            <TextField source="type" />
          </ReferenceField>
        </Datagrid>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default UserShow;
