import React from "react";
import {
	BooleanField,
	ReferenceField,
	Show,
	SimpleShowLayout,
	TextField,
	useRecordContext,
} from "react-admin";
import ImageField from "../../common/ImageField";
import { WidgetTemplatePreview } from "../previews";

const ShowTemplate: React.FC = (props) => (
	<Show {...props}>
		<SimpleShowLayout>
			<TextField source="templateId" label="ID" />
			<TextField source="type" label="Tipo" />
			<TextField source="name" label="Nome" />
			<ReferenceField
				source="subscriptionPlanId"
				reference="subscription-plan"
				label="Plano"
				emptyText="-"
			>
				<TextField source="name" />
			</ReferenceField>
			<ReferenceField
				source="streamerId"
				reference="streamers"
				label="Streamer"
				emptyText="-"
			>
				<TextField source="name" />
			</ReferenceField>
			<BooleanField source="default" label="Default" />
			<BooleanField source="enabled" label="Enabled" />
			<TemplateSpecificFields />
			<TemplatePreview />
		</SimpleShowLayout>
	</Show>
);

export default ShowTemplate;

const TemplateSpecificFields = () => {
	const record = useRecordContext<any>();
	const type = record?.type as string | undefined;

	if (!type) return null;

	if (type === "donation") {
		return (
			<>
				<ImageField source="imageUrl" label="Image" width={200} height={200} />
				<TextField source="titleColor" label="Title color" />
				<TextField source="messageColor" label="Message color" />
				<TextField source="backgroundColor" label="Background color" />
				<TextField source="borderColor" label="Border color" />
			</>
		);
	}

	if (type === "store") {
		return (
			<>
				<ImageField source="imageUrl" label="Image" width={200} height={200} />
				<TextField source="titleColor" label="Title color" />
				<TextField source="backgroundColor" label="Background color" />
				<TextField source="borderColor" label="Border color" />
			</>
		);
	}

	if (type === "goal") {
		return (
			<>
				<TextField source="progressColor" label="Progress color" />
				<TextField source="barColor" label="Bar color" />
				<TextField source="textColor" label="Text color" />
				<TextField source="valueColor" label="Value color" />
				<TextField source="backgroundColor" label="Background color" />
			</>
		);
	}

	if (type === "musicthon" || type === "rhynothon" || type === "qrcode") {
		return (
			<>
				<TextField source="backgroundColor" label="Background color" />
				<TextField source="textColor" label="Text color" />
			</>
		);
	}

	return null;
};

const TemplatePreview = () => {
	const record = useRecordContext<any>();
	if (!record) return null;

	return (
		<WidgetTemplatePreview
			data={{
				type: record.type,
				name: record.name,
				imageUrl: record.imageUrl,
				backgroundColor: record.backgroundColor,
				titleColor: record.titleColor,
				messageColor: record.messageColor,
				borderColor: record.borderColor,
				progressColor: record.progressColor,
				barColor: record.barColor,
				textColor: record.textColor,
				valueColor: record.valueColor,
			}}
		/>
	);
};
