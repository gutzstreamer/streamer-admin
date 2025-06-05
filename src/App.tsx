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
import InvoiceList from "./components/invoices/InvoiceList";
import InvoiceShow from "./components/invoices/InvoiceShow";
import CommissionStreamerList from "./components/commission-streamer/CommissionStreamerList";
import CommissionStreamerShow from "./components/commission-streamer/CommissionStreamerShow";
import { FactoryList } from "./components/factory/FactoryList";
import { FactoryShow } from "./components/factory/FactoryShow";
import StreamerRequestList from "./components/streamer-request/StrreamerRequestList";
import StreamerRequestShow from "./components/streamer-request/StreamerRequestShow";
import StreamerRequestEdit from "./components/streamer-request/StreamerRequestEdit";
import { WithdrawalList } from "./components/withdrawal-requests/WithdrawalRequestList";
import { WithdrawalEdit } from "./components/withdrawal-requests/WithdrawalRequestEdit";
import { WithdrawalShow } from "./components/withdrawal-requests/WithdrawalRequestShow";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={streamerDataProvider}
    authProvider={authProvider}
  >
    <Resource
      options={{ label: "Users" }}
      name="users"
      create={UserCreate}
      list={UserList}
      edit={UserEdit}
      show={UserShow}
    />
    <Resource
      options={{ label: "Profiles" }}
      name="profiles"
      list={ProfileList}
      edit={ProductEdit}
      show={ProfileShow}
    />
    <Resource
      name="address"
      list={AddressList}
      show={AddressShow}
      options={{ label: "Addresses" }}
    />
    <Resource
      name="wallets"
      list={WalletList}
      show={WalletShow}
      options={{ label: "Wallets" }}
    />
    <Resource
      options={{ label: "Wallet Transactions" }}
      name="wallet-transactions"
      list={WalletTransactionList}
      show={WalletTransactionShow}
    />
    <Resource
      options={{ label: "Streamer Requests" }}
      name="streamer-requests"
      list={StreamerRequestList}
      show={StreamerRequestShow}
      edit={StreamerRequestEdit}
    />
    <Resource
      options={{ label: "Streamer Profile" }}
      name="streamers"
      list={StreamerList}
      edit={StreamerEdit}
      show={StreamerShow}
      create={StreamerCreate}
    />
    <Resource
      options={{ label: "Streamer Commissions" }}
      name="commission-streamer"
      list={CommissionStreamerList}
      show={CommissionStreamerShow}
    />
    <Resource
      options={{ label: "Streamer Withdrawal" }}
      name="withdrawal-requests"
      list={WithdrawalList}
      edit={WithdrawalEdit}
      show={WithdrawalShow}
    />
    <Resource
      options={{ label: "Streamer Products" }}
      name="product-streamer"
      list={ProductStreamerList}
      show={ProductStreamerShow}
    />
    <Resource
      name="donations"
      list={DonateList}
      show={DonateShow}
      options={{ label: "Streamer Donations" }}
    />
    <Resource
      options={{ label: "Subscription Plans" }}
      name="subscription-plan"
      list={SubscriptionPlanListCopy}
      create={SubscriptionPlanCreate}
      edit={SubscriptionPlanEdit}
      show={SubscriptionPlanShow}
    />
    <Resource
      options={{ label: "Product Categories" }}
      name="categories"
      list={CategoryList}
      create={CategoryCreate}
      edit={CategoryEdit}
      show={CategoryShow}
    />
    <Resource
      options={{ label: "Products" }}
      name="products"
      list={ProductList}
      create={ProductCreate}
      edit={ProductEdit}
      show={ProductShow}
    />
    <Resource
      options={{ label: "Feature Toggles" }}
      name="feature-toggles"
      list={FeatureToggleList}
      create={FeatureToggleCreate}
      edit={FeatureToggleEdit}
      show={FeatureToggleShow}
    />
    <Resource
      name="orders"
      list={OrderList}
      show={OrderShow}
      options={{ label: "Orders" }}
    />
    <Resource
      name="invoices"
      list={InvoiceList}
      show={InvoiceShow}
      options={{ label: "Invoices" }}
    />
    <Resource
      options={{ label: "Order Billings" }}
      name="order-billings"
      list={OrderBillingList}
      show={OrderBillingShow}
    />
    <Resource name="factory" list={FactoryList} show={FactoryShow} />
    <Resource
      options={{ label: "Calculation Fees" }}
      name="calculation-fee"
      list={CalculationFeeList}
      show={CalculationFeeShow}
      edit={CalculationFeeEdit}
      create={CalculationFeeCreate}
    />
  </Admin>
);
