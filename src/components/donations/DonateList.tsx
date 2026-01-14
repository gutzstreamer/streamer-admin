import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  ReferenceField,
  DateField,
  Filter,
  TextInput,
  useDataProvider,
  useNotify,
} from "react-admin";
import { ListProps } from "react-admin";

const DonateFilter: React.FC = (props) => (
  <Filter {...props}>
    <TextInput label="Streamer ID" source="streamerId" alwaysOn />
  </Filter>
);

// Custom exporter que busca TODAS as doações
const donationsExporter = async (
  donations: any[],
  fetchRelatedRecords: any,
  dataProvider: any,
  notify: any
) => {
  try {
    notify("Buscando todas as doações...", { type: "info" });

    // Buscar todas as doações em lotes de 1000
    let allDonations: any[] = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const { data, total } = await dataProvider.getList("donations", {
        pagination: { page, perPage: 1000 },
        sort: { field: "createdAt", order: "DESC" },
        filter: {},
      });

      allDonations = [...allDonations, ...data];

      notify(
        `Carregadas ${allDonations.length} de ${total} doações...`,
        { type: "info" }
      );

      hasMore = allDonations.length < total;
      page++;
    }

    notify(`Total de ${allDonations.length} doações exportadas!`, {
      type: "success",
    });

    // Formatar os dados para exportação CSV
    const headers = [
      "ID",
      "StreamerID",
      "TransactionID",
      "Amount",
      "Fee",
      "NetAmount",
      "Message",
      "Username",
      "CreatedAt",
      "Paid",
      "SkipAlert",
    ];

    const csvRows = [headers.join(",")];

    allDonations.forEach((donation) => {
      const row = [
        donation.id || "",
        donation.streamerId || "",
        donation.transactionId || "",
        donation.amount || 0,
        donation.fee || 0,
        donation.netAmount || 0,
        `"${(donation.message || "").replace(/"/g, '""')}"`, // Escape aspas duplas
        `"${(donation.username || "").replace(/"/g, '""')}"`,
        new Date(donation.createdAt).toLocaleString("pt-BR"),
        donation.paid ? "Sim" : "Não",
        donation.skipAlert ? "Sim" : "Não",
      ];
      csvRows.push(row.join(","));
    });

    const csvContent = csvRows.join("\n");

    // Criar e baixar o arquivo CSV
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `donations_${new Date().toISOString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    notify("Erro ao buscar doações: " + error, { type: "error" });
  }
};

const DonateList = (props: ListProps) => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const exporter = (donations: any[], fetchRelatedRecords: any) =>
    donationsExporter(donations, fetchRelatedRecords, dataProvider, notify);

  return (
    <List {...props} filters={<DonateFilter />} exporter={exporter}>
      <Datagrid>
        <TextField source="id" />
        <ReferenceField source="streamerId" reference="streamers">
          <TextField source="name" />
        </ReferenceField>
        <ReferenceField source="transactionId" reference="wallet-transactions">
          <TextField source="status" />
        </ReferenceField>
        <NumberField
          source="amount"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <NumberField source="fee" locales="pt-BR" />
        <NumberField
          source="netAmount"
          options={{ style: "currency", currency: "BRL" }}
          locales="pt-BR"
        />
        <TextField source="message" />
        <TextField source="username" />
        <DateField source="createdAt" label="Created At" showTime />
      </Datagrid>
    </List>
  );
};

export default DonateList;
