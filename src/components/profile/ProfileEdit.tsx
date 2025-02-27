// {
//     "id": "41ad8f11-a472-422c-b36b-7d32f418741b",
//     "userId": "7fa47e79-4479-405f-8e29-91c9d7445026",
//     "image": "Everybody, rock your body!",
//     "nickname": "",
//     "address": [
//         {
//             "id": "6ec109f1-5027-405a-be69-2d0d24564b77",
//             "nickname": "Home",
//             "street": "Avenida Bussocaba",
//             "number": "850",
//             "complement": "12",
//             "neighborhood": "Umuarama",
//             "city": "Osasco",
//             "state": "SP",
//             "country": "BR",
//             "zipcode": "06036080"
//         }
//     ]

import { Edit, SimpleShowLayout, TextField } from "react-admin";

export const ProfileEdit: React.FC = (props) => {
  return (
    <Edit {...props}>
      <SimpleShowLayout>
        <TextField source="image" label="Imagem" />
        <TextField source="nickname" label="Apelido" />
      </SimpleShowLayout>
    </Edit>
  );
};
