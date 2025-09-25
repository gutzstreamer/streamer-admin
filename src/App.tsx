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
import { OrderCancelCreate } from "./components/order-cancel/OrderCancelCreate";
import { OrderCancelEdit } from "./components/order-cancel/OrderCancelEdit";
import { OrderCancelList } from "./components/order-cancel/OrderCancelList";
import { OrderCancelShow } from "./components/order-cancel/OrderCancelShow";
import { UserSubscriptionList } from "./components/subscription/UserSubscriptionList";
import { UserSubscriptionEdit } from "./components/subscription/UserSubscriptionEdit";
import { UserSubscriptionShow } from "./components/subscription/UserSubscriptionShow";
import SessionList from "./components/sessions/SessionList";
import SessionShow from "./components/sessions/SessionShow";
import {
  People,
  Subscriptions,
  AccountCircle,
  LocationOn,
  AccountBalanceWallet,
  SwapHoriz,
  Storefront,
  MonetizationOn,
  LocalMall,
  Favorite,
  Category,
  ShoppingCart,
  Cancel,
  Receipt,
  Payments,
  Factory,
  Calculate,
  ToggleOn,
  Visibility,
  PlaylistAddCheck,
  SupportAgent,
} from "@mui/icons-material";
import { SubscriptionUsageList } from "./components/subscription-usages/SubscriptionUsageList";
import { SubscriptionUsageCreate } from "./components/subscription-usages/SubscriptionUsageCreate";
import { SubscriptionUsageEdit } from "./components/subscription-usages/SubscriptionUsageEdit";
import { SubscriptionUsageShow } from "./components/subscription-usages/SubscriptionUsageShow";
import ProductStreamerEdit from "./components/products-streamer/ProductStreamerEdit";
import { ProfileEdit } from "./components/profile/ProfileEdit";
import CustomLoginPage from "./components/CustomLoginPage";
import ProductGridList from "./components/product-grids/ProductGridList";
import ProductGridCreate from "./components/product-grids/ProductGridCreate";
import ProductGridEdit from "./components/product-grids/ProductGridEdit";
import ProductGridShow from "./components/product-grids/ProductGridShow";
import Dashboard from "./components/Dashboard";

export const App = () => (
  <Admin
    layout={Layout}
    dataProvider={streamerDataProvider}
    authProvider={authProvider}
    loginPage={CustomLoginPage}
    dashboard={Dashboard}
  >
    <Resource
      options={{ label: "Users" }}
      name="users"
      icon={People}
      create={UserCreate}
      list={UserList}
      edit={UserEdit}
      show={UserShow}
    />
    <Resource
      options={{ label: "Subscription Plans" }}
      name="subscription-plan"
      icon={Subscriptions}
      list={SubscriptionPlanListCopy}
      create={SubscriptionPlanCreate}
      edit={SubscriptionPlanEdit}
      show={SubscriptionPlanShow}
    />
    <Resource
      options={{ label: "User Subscriptions" }}
      name="subscription"
      icon={Subscriptions}
      list={UserSubscriptionList}
      edit={UserSubscriptionEdit}
      show={UserSubscriptionShow}
    />
    <Resource
      options={{ label: "User Subscription Usage" }}
      name="subscription-usages"
      icon={Subscriptions}
      list={SubscriptionUsageList}
      show={SubscriptionUsageShow}
      edit={SubscriptionUsageEdit}
      create={SubscriptionUsageCreate}
    />
    <Resource
      options={{ label: "User Sessions" }}
      name="sessions"
      icon={Visibility}
      list={SessionList}
      show={SessionShow}
    />
    <Resource
      options={{ label: "Profiles" }}
      name="profiles"
      icon={AccountCircle}
      list={ProfileList}
      edit={ProfileEdit}
      show={ProfileShow}
    />
    <Resource
      name="address"
      icon={LocationOn}
      list={AddressList}
      show={AddressShow}
      options={{ label: "Addresses" }}
    />
    <Resource
      name="wallets"
      icon={AccountBalanceWallet}
      list={WalletList}
      show={WalletShow}
      options={{ label: "Wallets" }}
    />
    <Resource
      options={{ label: "Wallet Transactions" }}
      name="wallet-transactions"
      icon={SwapHoriz}
      list={WalletTransactionList}
      show={WalletTransactionShow}
    />
    <Resource
      options={{ label: "Streamer Requests" }}
      name="streamer-requests"
      icon={SupportAgent}
      list={StreamerRequestList}
      show={StreamerRequestShow}
      edit={StreamerRequestEdit}
    />
    <Resource
      options={{ label: "Streamer Profile" }}
      name="streamers"
      icon={Storefront}
      list={StreamerList}
      edit={StreamerEdit}
      show={StreamerShow}
    />
    <Resource
      options={{ label: "Streamer Commissions" }}
      name="commission-streamer"
      icon={MonetizationOn}
      list={CommissionStreamerList}
      show={CommissionStreamerShow}
    />
    <Resource
      options={{ label: "Streamer Withdrawal" }}
      name="withdrawal-requests"
      icon={MonetizationOn}
      list={WithdrawalList}
      edit={WithdrawalEdit}
      show={WithdrawalShow}
    />
    <Resource
      options={{ label: "Streamer Products" }}
      name="product-streamer"
      icon={LocalMall}
      list={ProductStreamerList}
      show={ProductStreamerShow}
      edit={ProductStreamerEdit}
    />
    <Resource
      name="donations"
      icon={Favorite}
      list={DonateList}
      show={DonateShow}
      options={{ label: "Streamer Donations" }}
    />

    <Resource
      options={{ label: "Product Categories" }}
      name="categories"
      icon={Category}
      list={CategoryList}
      create={CategoryCreate}
      edit={CategoryEdit}
      show={CategoryShow}
    />
    <Resource
      options={{ label: "Product Grid" }}
      name="product-grid"
      icon={PlaylistAddCheck}
      list={ProductGridList}
      create={ProductGridCreate}
      edit={ProductGridEdit}
      show={ProductGridShow}
    />
    <Resource
      options={{ label: "Products" }}
      name="products"
      icon={LocalMall}
      list={ProductList}
      create={ProductCreate}
      edit={ProductEdit}
      show={ProductShow}
    />
    <Resource
      options={{ label: "Feature Toggles" }}
      name="feature-toggles"
      icon={ToggleOn}
      list={FeatureToggleList}
      create={FeatureToggleCreate}
      edit={FeatureToggleEdit}
      show={FeatureToggleShow}
    />
    <Resource
      name="orders"
      icon={ShoppingCart}
      list={OrderList}
      show={OrderShow}
      options={{ label: "Orders" }}
    />
    <Resource
      options={{ label: "Order Cancel" }}
      name="order-cancel"
      icon={Cancel}
      list={OrderCancelList}
      edit={OrderCancelEdit}
      show={OrderCancelShow}
      create={OrderCancelCreate}
    />
    <Resource
      name="invoices"
      icon={Receipt}
      list={InvoiceList}
      show={InvoiceShow}
      options={{ label: "Invoices" }}
    />
    <Resource
      options={{ label: "Order Billings" }}
      name="order-billings"
      icon={Payments}
      list={OrderBillingList}
      show={OrderBillingShow}
    />
    <Resource
      name="factory"
      icon={Factory}
      list={FactoryList}
      show={FactoryShow}
    />
    <Resource
      options={{ label: "Calculation Fees" }}
      name="calculation-fee"
      icon={Calculate}
      list={CalculationFeeList}
      show={CalculationFeeShow}
      edit={CalculationFeeEdit}
      create={CalculationFeeCreate}
    />
  </Admin>
);
