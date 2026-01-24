import { Menu, MenuItemLink, useSidebarState } from "react-admin";

import PeopleIcon from "@mui/icons-material/People";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalMallIcon from "@mui/icons-material/LocalMall";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MicIcon from "@mui/icons-material/Mic";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LayersIcon from "@mui/icons-material/Layers";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";
import Divider from "@mui/material/Divider";
import ListSubheader from "@mui/material/ListSubheader";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import QueueMusicIcon from "@mui/icons-material/QueueMusic";

export const CustomMenu = () => {
  const [open] = useSidebarState();

  return (
    <Menu>
      {/* Dashboard */}
      <MenuItemLink
        to="/dashboard"
        primaryText="📊 Dashboard"
        leftIcon={<DashboardIcon />}
      />
      <Divider />

      {/* Usuários */}
      <ListSubheader inset>Usuários</ListSubheader>
      <MenuItemLink
        to="/users"
        primaryText="Usuários"
        leftIcon={<PeopleIcon />}
      />
      <MenuItemLink
        to="/profiles"
        primaryText="Perfis"
        leftIcon={<PeopleIcon />}
      />
      <MenuItemLink
        to="/subscription"
        primaryText="Assinaturas"
        leftIcon={<SubscriptionsIcon />}
      />
      <MenuItemLink
        to="/subscription-usages"
        primaryText="Usos de Assinatura"
        leftIcon={<SubscriptionsIcon />}
      />
      <MenuItemLink
        to="/sessions"
        primaryText="Sessões"
        leftIcon={<PeopleIcon />}
      />

      <Divider />

      {/* Streamers */}
      <ListSubheader inset>Streamers</ListSubheader>
      <MenuItemLink
        to="/streamers"
        primaryText="Perfil"
        leftIcon={<StorefrontIcon />}
      />
      <MenuItemLink
        to="/product-streamer"
        primaryText="Produtos"
        leftIcon={<LocalMallIcon />}
      />
      <MenuItemLink
        to="/commission-streamer"
        primaryText="Comissões"
        leftIcon={<LocalMallIcon />}
      />
      <MenuItemLink
        to="/refer"
        primaryText="Indicações"
        leftIcon={<PeopleIcon />}
      />
      <MenuItemLink
        to="/donations"
        primaryText="Doações"
        leftIcon={<LocalMallIcon />}
      />
      <MenuItemLink
        to="/streamer-requests"
        primaryText="Solicitações"
        leftIcon={<StorefrontIcon />}
      />
      <MenuItemLink
        to="/withdrawal-requests"
        primaryText="Saques"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/monthly-service-invoices"
        primaryText="Notas Fiscais Mensais"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/streaming-platform-integrations"
        primaryText="Integrações"
        leftIcon={<StorefrontIcon />}
      />
      <MenuItemLink
        to="/platform-webhooks"
        primaryText="Webhooks"
        leftIcon={<StorefrontIcon />}
      />

      <Divider />

      {/* Monitoramento */}
      <ListSubheader inset>Monitoramento</ListSubheader>
      <MenuItemLink
        to="/chat-mentions"
        primaryText="Menções no Chat"
        leftIcon={<ChatBubbleIcon />}
      />
      <MenuItemLink
        to="/alert-queues"
        primaryText="Filas de Alertas"
        leftIcon={<NotificationsActiveIcon />}
      />
      <MenuItemLink
        to="/musicthon-queues"
        primaryText="Filas do Musicthon"
        leftIcon={<QueueMusicIcon />}
      />

      <Divider />

      {/* Produtos */}
      <ListSubheader inset>Produtos</ListSubheader>
      <MenuItemLink
        to="/products"
        primaryText="Produtos"
        leftIcon={<LocalMallIcon />}
      />
      <MenuItemLink
        to="/categories"
        primaryText="Categorias"
        leftIcon={<LocalMallIcon />}
      />
      <MenuItemLink
        to="/product-grid"
        primaryText="Grade de Produtos"
        leftIcon={<LocalMallIcon />}
      />

      <Divider />

      {/* Financeiro */}
      <ListSubheader inset>Financeiro</ListSubheader>
      <MenuItemLink
        to="/wallets"
        primaryText="Carteiras"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/wallet-transactions"
        primaryText="Transações"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/invoices"
        primaryText="Notas Fiscais"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/factory"
        primaryText="Dimona"
        leftIcon={<LocalMallIcon />}
      />
      <MenuItemLink
        to="/orders"
        primaryText="Pedidos"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/order-billings"
        primaryText="Cobranças"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/order-cancel"
        primaryText="Cancelamentos"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <MenuItemLink
        to="/calculation-fee"
        primaryText="Taxas"
        leftIcon={<AccountBalanceWalletIcon />}
      />
      <Divider />

      {/* Vozes de IA */}
      <ListSubheader inset>Alertas</ListSubheader>
      <MenuItemLink
        to="/ai-voice"
        primaryText="Gerenciar Vozes"
        leftIcon={<MicIcon />}
      />
      <Divider />

      {/* Sistema */}
      <ListSubheader inset>Configurações</ListSubheader>
      <MenuItemLink
        to="/subscription-plan"
        primaryText="Planos de Assinatura"
        leftIcon={<SettingsIcon />}
      />
      <MenuItemLink
        to="/platform-benefits"
        primaryText="Benefícios da Plataforma"
        leftIcon={<EmojiEventsIcon />}
      />
      <MenuItemLink
        to="/tier-config"
        primaryText="Configuração de Tiers"
        leftIcon={<LayersIcon />}
      />
      <MenuItemLink
        to="/fan-plans"
        primaryText="Planos de Fãs"
        leftIcon={<DashboardCustomizeIcon />}
      />
      <MenuItemLink
        to="/feature-toggles"
        primaryText="Feature Toggles"
        leftIcon={<SettingsIcon />}
      />


    </Menu>
  );
};
