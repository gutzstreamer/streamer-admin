import React from "react";
import {
	AutocompleteInput,
	BooleanInput,
	Edit,
	ReferenceInput,
	SelectInput,
	SimpleForm,
	TextInput,
	required,
} from "react-admin";
import { useWatch } from "react-hook-form";
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

const EditTemplate: React.FC = (props) => (
	<Edit {...props}>
		<SimpleForm>
			<TextInput source="templateId" label="ID" disabled fullWidth />
			<SelectInput
				source="type"
				label="Tipo"
				choices={typeChoices}
				validate={[required()]}
				disabled
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
			<BooleanInput source="enabled" label="Enabled" />
			<TemplateSpecificFields />
			<TemplatePreview />
		</SimpleForm>
	</Edit>
);

export default EditTemplate;

const TemplateSpecificFields = () => {
	const type = useWatch({ name: "type" }) as string | undefined;

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
