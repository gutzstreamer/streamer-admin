export const StatusOrder = {
  PENDING: "PENDING",
  PAID: "PAID",
  FACTORY: "FACTORY",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELED: "CANCELED",
};

export const statusOrderChoices = Object.entries(StatusOrder).map(
  ([key, value]) => ({
    id: value,
    name: key.charAt(0) + key.slice(1).toLowerCase(),
  }),
);
