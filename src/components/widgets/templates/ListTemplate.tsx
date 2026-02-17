import { DefaultPagination } from "../../common/DefaultPagination";
import React, { useEffect } from "react";
import {
	BooleanField,
	Datagrid,
	DateField,
	List,
	ReferenceField,
	SelectInput,
	TextField,
	TextInput,
	useListContext,
} from "react-admin";

const typeChoices = [
	{ id: "donation", name: "Donation" },
	{ id: "goal", name: "Goal" },
	{ id: "rhynothon", name: "Rhynothon" },
	{ id: "musicthon", name: "Musicthon" },
	{ id: "qrcode", name: "QRCode" },
	{ id: "store", name: "Store" },
];

const defaultChoices = [
	{ id: true, name: "Default" },
	{ id: false, name: "Nao default" },
];

const TemplateListLogger: React.FC = () => {
	const { filterValues, displayedFilters, isLoading, total } = useListContext();

	useEffect(() => {
		console.debug("[TemplateList] state", {
			filterValues,
			displayedFilters,
			isLoading,
			total,
		});
	}, [filterValues, displayedFilters, isLoading, total]);

	return null;
};

const TemplateList: React.FC = (props) => (
	<List pagination={<DefaultPagination />}
		{...props}
		perPage={25}
		sort={{ field: "createdAt", order: "DESC" }}
		filters={[
			<SelectInput
				key="type"
				source="type"
				label="Tipo"
				choices={typeChoices}
				alwaysOn
			/>,
			<SelectInput
				key="default"
				source="default"
				label="Default"
				choices={defaultChoices}
				emptyText="Todos"
			/>,
			<TextInput
				key="subscriptionPlanId"
				source="subscriptionPlanId"
				label="Plano (ID)"
			/>,
			<TextInput key="streamerId" source="streamerId" label="Streamer (ID)" />,
		]}
		filterDefaultValues={{ type: "donation", default: true }}
	>
		<TemplateListLogger />
		<Datagrid rowClick="show">
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
			<DateField source="createdAt" label="Criado" showTime />
		</Datagrid>
	</List>
);

export default TemplateList;

