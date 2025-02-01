import { Admin, Resource } from "react-admin";
import { Layout } from "./Layout";
import streamerDataProvider from "./dataProvider";
import { authProvider } from "./authProvider";
import UserList from "./components/users/UserList";
import StreamerList from "./components/streamers/StreamerList";
import UserCreate from "./components/users/UserCreate";
import UserEdit from "./components/users/UserEdit";
import CategoryCreate from "./components/categories/CategoryCreate";
import CategoryEdit from "./components/categories/CategoryEdit";
import CategoryList from "./components/categories/CategoryList";
import CategoryShow from "./components/categories/CategoryShow";
import StreamerEdit from "./components/streamers/StreamerEdit";
import StreamerShow from "./components/streamers/StreamerShow";
import StreamerCreate from "./components/streamers/StreamerCreate";
import UserShow from "./components/users/UserShow";
import ProductCreate from "./components/products/ProductCreate";
import ProductEdit from "./components/products/ProductEdit";
import ProductList from "./components/products/ProductList";
import ProductShow from "./components/products/ProductShow";
import WalletList from "./components/wallet/WalletList";
import WalletTransactionList from "./components/wallet-transactions/WalletTransactionList";
import WalletTransactionShow from "./components/wallet-transactions/WalletTransactionShow";
import WalletShow from "./components/wallet/WalletShow";
import DonateList from "./components/donations/DonateList";
import DonateShow from "./components/donations/DonateShow";
import ProductStreamerList from "./components/products-streamer/ProductSteamerList";
import ProductStreamerShow from "./components/products-streamer/ProductStreamerShow";
import SubscriptionPlanList from "./components/subscription-plan/SubscriptionPlanList";
import SubscriptionPlanCreate from "./components/subscription-plan/SubScriptionPlanCreate";
import SubscriptionPlanEdit from "./components/subscription-plan/SubScriptionPlanEdit";
import SubscriptionPlanShow from "./components/subscription-plan/SubScriptionPlanShow";

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
      show={UserShow}
    />
    <Resource name="wallets" list={WalletList} show={WalletShow} />
    <Resource
      name="wallet-transactions"
      list={WalletTransactionList}
      show={WalletTransactionShow}
    />
    <Resource
      name="streamers"
      list={StreamerList}
      edit={StreamerEdit}
      show={StreamerShow}
      create={StreamerCreate}
    />
    <Resource
      name="product-streamer"
      list={ProductStreamerList}
      show={ProductStreamerShow}
    />
    <Resource name="donations" list={DonateList} show={DonateShow} />
    <Resource
      name="subscription-plan"
      // list={SubscriptionPlanList}
      create={SubscriptionPlanCreate}
      edit={SubscriptionPlanEdit}
      show={SubscriptionPlanShow}
    />
    <Resource
      name="categories"
      list={CategoryList}
      create={CategoryCreate}
      edit={CategoryEdit}
      show={CategoryShow}
    />
    <Resource
      name="products"
      list={ProductList}
      create={ProductCreate}
      edit={ProductEdit}
      show={ProductShow}
    />
  </Admin>
);
