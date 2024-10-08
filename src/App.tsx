import { Admin, Resource, EditGuesser, ShowGuesser } from "react-admin";
import { Layout } from "./Layout";
import streamerDataProvider from "./dataProvider";
import { authProvider } from "./authProvider";
import UserList from "./components/users/UserList";
import StreamerList from "./components/streamers/StreamerList";
import SubScriptionPlanList from "./components/subscription-plan/SubScriptionPlanList";
import UserCreate from "./components/users/UserCreate";
import UserEdit from "./components/users/UserEdit";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={streamerDataProvider}
    authProvider={authProvider}
  >
    <Resource
      name="users"
      create={UserCreate}
      list={UserList}
      edit={UserEdit}
      show={ShowGuesser}
    />
    <Resource
      name="streamers"
      list={StreamerList}
      edit={EditGuesser}
      show={ShowGuesser}
    />
    <Resource
      name="subscription-plan"
      list={SubScriptionPlanList}
      edit={EditGuesser}
      show={ShowGuesser}
    />
  </Admin>
);