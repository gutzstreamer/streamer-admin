import React from "react";
import {
  ArrayField,
  ChipField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from "react-admin";


const StreamerShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <ReferenceField source="userId" reference="users">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="bio" />
      <TextField source="image" />
      <ArrayField source="games">
        <SingleFieldList linkType={false}>
          <ChipField source="name" />
        </SingleFieldList>
      </ArrayField>
      <ArrayField source="links">
        <SingleFieldList linkType={false}>
          <ChipField source="url" />
        </SingleFieldList>
      </ArrayField>
    </SimpleShowLayout>
  </Show>
);

export default StreamerShow;
