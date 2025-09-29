import React from "react";
import { TopToolbar, DeleteButton } from "react-admin";

const PlatformWebhookShowActions: React.FC = () => (
  <TopToolbar>
    <DeleteButton 
      mutationMode="pessimistic" 
      confirmContent="Are you sure you want to delete this webhook? This action cannot be undone."
    />
  </TopToolbar>
);

export default PlatformWebhookShowActions;