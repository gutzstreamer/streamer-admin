import React from "react";
import {
  BooleanInput,
  Create,
  NumberInput,
  SelectInput,
  SimpleForm,
  TextInput,
  required,
  useRefresh,
  useRedirect,
} from "react-admin";
import { useWatch } from "react-hook-form";

const typeChoices = [
  { id: "GENERIC", name: "Generic" },
  { id: "COUPON", name: "Coupon" },
  { id: "LIVE_NOTIFICATION", name: "Live notification" },
];

const tierChoices = [
  { id: "TIER1", name: "Tier 1" },
  { id: "TIER2", name: "Tier 2" },
  { id: "TIER3", name: "Tier 3" },
];

const configRenderers: Record<string, React.FC> = {
  COUPON: () => (
    <>
      <NumberInput
        source="config.discountPercent"
        label="Discount (%)"
        min={1}
        max={100}
        helperText="Optional. Use percent OR value."
      />
      <NumberInput
        source="config.discountValue"
        label="Discount value"
        min={1}
        helperText="Optional. Use value OR percent."
      />
      <NumberInput
        source="config.quantityPerCycle"
        label="Quantity per cycle"
        min={1}
        helperText="How many coupons to issue each cycle"
      />
    </>
  ),
};

const PlatformBenefitCreate: React.FC = (props) => {
  const refresh = useRefresh();
  const redirect = useRedirect();

  return (
    <Create
      {...props}
      mutationOptions={{
        onSuccess: () => {
          refresh();
          redirect("list");
        },
      }}
    >
      <SimpleForm>
        <TextInput
          source="name"
          label="Name"
          fullWidth
          validate={[required()]}
        />
        <TextInput
          source="description"
          label="Description"
          fullWidth
          multiline
          minRows={2}
          validate={[required()]}
        />
        <SelectInput
          source="type"
          label="Type"
          validate={[required()]}
          choices={typeChoices}
        />
        <SelectInput
          source="tier"
          label="Tier"
          validate={[required()]}
          choices={tierChoices}
        />
        <ConfigFields />
        <NumberInput
          source="limitPerCycle"
          label="Limit per cycle"
          min={0}
          step={1}
          helperText="Leave empty for unlimited"
        />
        <NumberInput
          source="expiresAfterDays"
          label="Expires after (days)"
          min={0}
          step={1}
          helperText="Leave empty to never expire"
        />
        <BooleanInput source="active" label="Active" defaultValue />
      </SimpleForm>
    </Create>
  );
};

export default PlatformBenefitCreate;

const ConfigFields = () => {
  const type = useWatch({ name: "type" });

  const Renderer = type ? configRenderers[type] : undefined;
  return Renderer ? <Renderer /> : null;
};
