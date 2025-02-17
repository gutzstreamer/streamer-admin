import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  DateField,
  NumberField,
  ArrayField,
  useRecordContext,
  ReferenceField,
} from "react-admin";
import "./OrderShow.css";

const OrderStatusTimeline = () => {
  const record = useRecordContext();
  if (!record || !record.orderStatus) return null;

  return (
    <div className="timeline">
      {record.orderStatus.map((status: any, index: any) => (
        <div key={index} className="timeline-item">
          <div className="timeline-dot" />
          <div className="timeline-content">
            <div className="timeline-status">{status.name}</div>
            <div className="timeline-date">
              {new Date(status.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const OrderShow: React.FC = (props) => {
  return (
    <Show {...props}>
      <SimpleShowLayout>
        <TextField source="id" label="Order ID" />
        <ReferenceField source="userId" reference="users">
            <TextField source="name" />
        </ReferenceField>
        <TextField source="addressId" label="Address ID" />
        <TextField source="paymentType" label="Payment Type" />
        <NumberField source="totalProducts" label="Total Products" />
        <NumberField source="totalShipping" label="Total Shipping" />
        <DateField source="createdAt" label="Created At" />
        <DateField source="updatedAt" label="Updated At" />
        <ArrayField source="orderStatus" label="Order Status Timeline">
          <OrderStatusTimeline />
        </ArrayField>
      </SimpleShowLayout>
    </Show>
  );
};

export default OrderShow;
