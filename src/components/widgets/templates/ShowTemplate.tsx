import React from "react";
import {
	BooleanField,
	Labeled,
	ReferenceField,
	Show,
	SimpleShowLayout,
	TextField,
	useRecordContext,
} from "react-admin";
import { Box } from "@mui/material";
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
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				<Labeled label="Image">
					<ImageField source="imageUrl" width={200} height={200} />
				</Labeled>
				<Labeled label="Title color">
					<TextField source="titleColor" />
				</Labeled>
				<Labeled label="Message color">
					<TextField source="messageColor" />
				</Labeled>
				<Labeled label="Background color">
					<TextField source="backgroundColor" />
				</Labeled>
			</Box>
		);
	}

	if (type === "store") {
		return (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				<Labeled label="Image">
					<ImageField source="imageUrl" width={200} height={200} />
				</Labeled>
				<Labeled label="Title color">
					<TextField source="titleColor" />
				</Labeled>
				<Labeled label="Background color">
					<TextField source="backgroundColor" />
				</Labeled>
			</Box>
		);
	}

	if (type === "goal") {
		return (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				<Labeled label="Progress color">
					<TextField source="progressColor" />
				</Labeled>
				<Labeled label="Bar color">
					<TextField source="barColor" />
				</Labeled>
				<Labeled label="Text color">
					<TextField source="textColor" />
				</Labeled>
				<Labeled label="Value color">
					<TextField source="valueColor" />
				</Labeled>
				<Labeled label="Background color">
					<TextField source="backgroundColor" />
				</Labeled>
			</Box>
		);
	}

	if (type === "musicthon" || type === "rhynothon" || type === "qrcode") {
		return (
			<Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
				<Labeled label="Background color">
					<TextField source="backgroundColor" />
				</Labeled>
				<Labeled label="Text color">
					<TextField source="textColor" />
				</Labeled>
			</Box>
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
				progressColor: record.progressColor,
				barColor: record.barColor,
				textColor: record.textColor,
				valueColor: record.valueColor,
			}}
		/>
	);
};
