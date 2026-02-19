import React, { useEffect } from "react";
import {
	AutocompleteInput,
	BooleanInput,
	Create,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
	required,
} from "react-admin";
import { useFormContext, useWatch } from "react-hook-form";
import ColorPickerInput from "../../common/ColorPickerInput";
import ImageUrlInput from "../../common/ImageUrlInput";
import { WidgetTemplatePreview } from "../previews";

const typeChoices = [
	{ id: "donation", name: "Donation" },
	{ id: "goal", name: "Goal" },
	{ id: "rhynothon", name: "Rhynothon" },
	{ id: "musicthon", name: "Musicthon" },
	{ id: "qrcode", name: "QRCode" },
	{ id: "store", name: "Store" },
];

const CreateTemplate: React.FC = (props) => (
	<Create {...props}>
		<SimpleForm>
			<SelectInput
				source="type"
				label="Tipo"
				choices={typeChoices}
				validate={[required()]}
			/>
			<TextInput source="name" label="Nome" validate={[required()]} fullWidth />
			<ReferenceInput
				source="subscriptionPlanId"
				reference="subscription-plan"
				label="Plano"
			>
				<SelectInput optionText="name" emptyText="Nenhum" fullWidth />
			</ReferenceInput>
			<ReferenceInput source="streamerId" reference="streamers" label="Streamer">
				<AutocompleteInput
					optionText={(choice) => `${choice.name} (@${choice.atname})`}
					emptyText="Nenhum"
					fullWidth
					filterToQuery={(searchText) => ({ name: searchText, atname: searchText })}
				/>
			</ReferenceInput>
			<BooleanInput source="default" label="Default" />
			<BooleanInput source="enabled" label="Enabled" defaultValue />
			<TemplateSpecificFields />
			<TemplatePreview />
		</SimpleForm>
	</Create>
);

export default CreateTemplate;

const TemplateSpecificFields = () => {
	const type = useWatch({ name: "type" }) as string | undefined;
	const { getValues, setValue } = useFormContext();

	useEffect(() => {
		if (!type) return;

		const defaults: Record<string, string> = {};

		switch (type) {
			case "donation":
				defaults.backgroundColor = "#572aae";
				defaults.titleColor = "#ffffff";
				defaults.messageColor = "#ffffff";
				break;
			case "store":
				defaults.backgroundColor = "#572aae";
				defaults.titleColor = "#ffffff";
				break;
			case "goal":
				defaults.progressColor = "#9c27b0";
				defaults.barColor = "#ffffff";
				defaults.textColor = "#000000";
				defaults.valueColor = "#000000";
				break;
			case "musicthon":
				defaults.backgroundColor = "#9c27b0";
				defaults.textColor = "#ffffff";
				break;
			case "qrcode":
				defaults.backgroundColor = "#7b1fa2";
				defaults.textColor = "#ffffff";
				break;
			case "rhynothon":
				defaults.backgroundColor = "#000000";
				defaults.textColor = "#ffffff";
				break;
			default:
				break;
		}

		Object.entries(defaults).forEach(([key, value]) => {
			const current = getValues(key);
			if (current === undefined || current === "") {
				setValue(key, value, { shouldDirty: true, shouldTouch: true });
			}
		});
	}, [type, getValues, setValue]);

	if (!type) return null;

	if (type === "donation") {
		return (
			<>
				<ImageUrlInput
					source="imageUrl"
					label="Image URL"
					helperText="Public URL or base64 data URL"
				/>
				<ColorPickerInput source="titleColor" label="Title color" />
				<ColorPickerInput source="messageColor" label="Message color" />
				<ColorPickerInput source="backgroundColor" label="Background color" />
			</>
		);
	}

	if (type === "store") {
		return (
			<>
				<ImageUrlInput
					source="imageUrl"
					label="Image URL"
					helperText="Public URL or base64 data URL"
				/>
				<ColorPickerInput source="titleColor" label="Title color" />
				<ColorPickerInput source="backgroundColor" label="Background color" />
			</>
		);
	}

	if (type === "goal") {
		return (
			<>
				<ColorPickerInput source="progressColor" label="Progress color" />
				<ColorPickerInput source="barColor" label="Bar color" />
				<ColorPickerInput source="textColor" label="Text color" />
				<ColorPickerInput source="valueColor" label="Value color" />
				<ColorPickerInput source="backgroundColor" label="Background color" />
			</>
		);
	}

	if (type === "musicthon" || type === "rhynothon" || type === "qrcode") {
		return (
			<>
				<ColorPickerInput source="backgroundColor" label="Background color" />
				<ColorPickerInput source="textColor" label="Text color" />
			</>
		);
	}

	return null;
};

const TemplatePreview = () => {
	const formValues = useWatch() as Record<string, any>;

	return (
		<WidgetTemplatePreview
			data={{
				type: formValues.type,
				name: formValues.name,
				imageUrl: formValues.imageUrl,
				backgroundColor: formValues.backgroundColor,
				titleColor: formValues.titleColor,
				messageColor: formValues.messageColor,
				progressColor: formValues.progressColor,
				barColor: formValues.barColor,
				textColor: formValues.textColor,
				valueColor: formValues.valueColor,
			}}
		/>
	);
};
