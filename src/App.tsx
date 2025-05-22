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
import SubscriptionPlanCreate from "./components/subscription-plan/SubScriptionPlanCreate";
import SubscriptionPlanEdit from "./components/subscription-plan/SubScriptionPlanEdit";
import SubscriptionPlanShow from "./components/subscription-plan/SubScriptionPlanShow";
import SubscriptionPlanListCopy from "./components/subscription-plan/SubscriptionPlanListCopy";
import FeatureToggleList from "./components/feature-toggles/FeatureToggleList";
import FeatureToggleCreate from "./components/feature-toggles/FeatureToggleCreate";
import FeatureToggleShow from "./components/feature-toggles/FeatureToggleShow";
import FeatureToggleEdit from "./components/feature-toggles/FeatureToggleEdit";
import OrderList from "./components/orders/OrderList";
import OrderShow from "./components/orders/OrderShow";
import CalculationFeeList from "./components/calculation-fee/CalculationFeeList";
import CalculationFeeShow from "./components/calculation-fee/CalculationFeeShow";
import CalculationFeeEdit from "./components/calculation-fee/CalculationFeeEdit";
import CalculationFeeCreate from "./components/calculation-fee/CalculationFeeCreate";
import ProfileList from "./components/profile/ProfileList";
import { ProfileShow } from "./components/profile/ProfileShow";
import { AddressList } from "./components/address/AddressList";
import { AddressShow } from "./components/address/AddressShow";
import { OrderBillingShow } from "./components/order-billing/OrderBillingShow";
import { OrderBillingList } from "./components/order-billing/OrderBillingList";
import ErrorLogList from "./components/error-log/ErrorLogList";
import ErrorLogShow from "./components/error-log/ErrorLogShow";
import InvoiceList from "./components/invoices/InvoiceList";
import InvoiceShow from "./components/invoices/InvoiceShow";
import CommissionStreamerList from "./components/commission-streamer/CommissionStreamerList";
import CommissionStreamerShow from "./components/commission-streamer/CommissionStreamerShow";
import { FactoryList } from "./components/factory/FactoryList";
import { FactoryShow } from "./components/factory/FactoryShow";

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
    <Resource
      name="profiles"
      list={ProfileList}
      edit={ProductEdit}
      show={ProfileShow}
    />
    <Resource name="address" list={AddressList} show={AddressShow} />
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
      name="commission-streamer"
      list={CommissionStreamerList}
      show={CommissionStreamerShow}
    />
    <Resource
      name="product-streamer"
      list={ProductStreamerList}
      show={ProductStreamerShow}
    />
    <Resource name="donations" list={DonateList} show={DonateShow} />
    <Resource
      name="subscription-plan"
      list={SubscriptionPlanListCopy}
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
    <Resource
      name="feature-toggles"
      list={FeatureToggleList}
      create={FeatureToggleCreate}
      edit={FeatureToggleEdit}
      show={FeatureToggleShow}
    />
    <Resource name="orders" list={OrderList} show={OrderShow} />
    <Resource name="invoices" list={InvoiceList} show={InvoiceShow} />
    <Resource
      name="order-billings"
      list={OrderBillingList}
      show={OrderBillingShow}
    />
    <Resource name="factory" list={FactoryList} show={FactoryShow} />
    <Resource
      name="calculation-fee"
      list={CalculationFeeList}
      show={CalculationFeeShow}
      edit={CalculationFeeEdit}
      create={CalculationFeeCreate}
    />

    <Resource name="error-log" list={ErrorLogList} show={ErrorLogShow} />
  </Admin>
);
