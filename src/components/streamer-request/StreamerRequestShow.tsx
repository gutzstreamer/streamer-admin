import React from "react";
import {
  ArrayField,
  BooleanField,
  ChipField,
  DateField,
  ReferenceField,
  Show,
  SimpleShowLayout,
  SingleFieldList,
  TextField,
} from "react-admin";

const SteamerRequestShow: React.FC = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="email" />
      <TextField source="phone" />
      <TextField source="description" />
      <DateField source="createdAt" />
      <DateField source="updatedAt" />
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

//  {
//         "name": "StreamerName",
//         "email": "streamer@example.com",
//         "phone": "+1234567890",
//         "description": "This is a request for a new streamer.",
//         "createdAt": "2025-05-27T15:23:58.695Z",
//         "updatedAt": "2025-05-27T15:23:58.695Z",
//         "id": "1114d0b1-c631-4b54-b728-656b5f9cc45a",
//         "approved": false,
//         "links": [
//             {
//                 "id": "ca0da544-b786-4dcb-bc63-01622db9c133",
//                 "requestId": "1114d0b1-c631-4b54-b728-656b5f9cc45a",
//                 "type": "Instagram",
//                 "url": "https://example.com/streamer-request"
//             },
//             {
//                 "id": "af29da6c-749b-4f82-9a64-f132f62c29e6",
//                 "requestId": "1114d0b1-c631-4b54-b728-656b5f9cc45a",
//                 "type": "YouTube",
//                 "url": "https://example.com/streamer-request2"
//             }
//         ]
//     }
