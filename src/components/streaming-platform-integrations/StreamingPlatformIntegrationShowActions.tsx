import React from "react";
import { TopToolbar, DeleteButton } from "react-admin";

const StreamingPlatformIntegrationShowActions: React.FC = () => (
  <TopToolbar>
    <DeleteButton 
      mutationMode="pessimistic" 
      confirmContent="Are you sure you want to delete this integration? This action cannot be undone."
    />
  </TopToolbar>
);

export default StreamingPlatformIntegrationShowActions;