import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  ReferenceManyField,
  Datagrid,
  UrlField,
} from "react-admin";

const MonthlyServiceInvoiceShow: React.FC = (props) => {
  return (
    <Show {...props} title="Detalhes da Nota Fiscal Mensal">
      <SimpleShowLayout>
        <TextField source="id" label="ID" />
        <NumberField source="year" label="Ano" />
        <NumberField source="month" label="Mês" />
        
        <ReferenceField source="streamerId" reference="streamers" label="Streamer">
          <TextField source="name" />
        </ReferenceField>
        
        <NumberField 
          source="totalAmount" 
          label="Valor Total dos Saques" 
          options={{ style: 'currency', currency: 'BRL' }} 
        />
        <NumberField 
          source="totalFee" 
          label="Total de Taxas" 
          options={{ style: 'currency', currency: 'BRL' }} 
        />
        <NumberField 
          source="netAmount" 
          label="Valor Líquido" 
          options={{ style: 'currency', currency: 'BRL' }} 
        />
        <NumberField source="withdrawalCount" label="Quantidade de Saques" />
        
        <DateField source="createdAt" label="Criado em" showTime />
        <DateField source="updatedAt" label="Atualizado em" showTime />
        
        {/* Dados da Nota Fiscal de Serviço */}
        <TextField source="serviceInvoice.integrationId" label="ID de Integração NFS" />
        <TextField source="serviceInvoice.status" label="Status da NFS" />
        <UrlField source="serviceInvoice.pdfUrl" label="PDF da NFS" target="_blank" />
        
        {/* Lista dos Saques */}
        <ReferenceManyField
          reference="withdrawal-requests"
          target="monthlyServiceInvoiceId"
          label="Saques Incluídos"
        >
          <Datagrid>
            <TextField source="id" label="ID do Saque" />
            <NumberField 
              source="amount" 
              label="Valor" 
              options={{ style: 'currency', currency: 'BRL' }} 
            />
            <NumberField 
              source="fee" 
              label="Taxa" 
              options={{ style: 'currency', currency: 'BRL' }} 
            />
            <NumberField 
              source="finalAmount" 
              label="Valor Final" 
              options={{ style: 'currency', currency: 'BRL' }} 
            />
            <TextField source="status" label="Status" />
            <DateField source="createdAt" label="Criado em" />
          </Datagrid>
        </ReferenceManyField>
      </SimpleShowLayout>
    </Show>
  );
};

export default MonthlyServiceInvoiceShow;