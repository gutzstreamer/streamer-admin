import React from "react";
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  ReferenceField,
  FunctionField,
  useRecordContext,
} from "react-admin";
import { Chip, Box, Typography, Card, CardContent, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { Link } from "react-router-dom";
import { Receipt as ReceiptIcon } from "@mui/icons-material";

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
        
        {/* Nota Fiscal de Serviço Vinculada */}
        <FunctionField
          label="Nota Fiscal de Serviço"
          render={(record: any) => {
            if (!record.serviceInvoiceId) {
              return (
                <Chip 
                  label="Aguardando geração" 
                  color="warning" 
                  size="small"
                  icon={<ReceiptIcon />}
                />
              );
            }
            
            return (
              <Card variant="outlined" sx={{ maxWidth: 600 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <ReceiptIcon color="primary" />
                    <Typography variant="h6">
                      Nota Fiscal de Serviço
                    </Typography>
                    <Chip 
                      label={record.serviceInvoice?.status || "Gerada"} 
                      color="success" 
                      size="small"
                    />
                  </Box>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      <strong>ID:</strong> {record.serviceInvoiceId}
                    </Typography>
                    
                    {record.serviceInvoice?.rpsNumber && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>RPS Número:</strong> {record.serviceInvoice.rpsNumber}
                      </Typography>
                    )}
                    
                    {record.serviceInvoice?.rpsSeries && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>RPS Série:</strong> {record.serviceInvoice.rpsSeries}
                      </Typography>
                    )}
                    
                    {record.serviceInvoice?.city && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Município:</strong> {record.serviceInvoice.city}/{record.serviceInvoice.state}
                      </Typography>
                    )}
                    
                    {record.serviceInvoice?.pdfUrl && (
                      <Box mt={2}>
                        <a 
                          href={record.serviceInvoice.pdfUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{ textDecoration: 'none' }}
                        >
                          <Chip 
                            label="📄 Baixar PDF" 
                            color="primary" 
                            clickable
                            size="small"
                          />
                        </a>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          }}
        />
        
        {/* Lista dos Saques */}
        <FunctionField
          label="Saques Incluídos"
          render={(record: any) => {
            if (!record.withdrawals || record.withdrawals.length === 0) {
              return (
                <Typography variant="body2" color="text.secondary">
                  Nenhum saque encontrado
                </Typography>
              );
            }

            return (
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>ID do Saque</strong></TableCell>
                      <TableCell align="right"><strong>Valor</strong></TableCell>
                      <TableCell align="right"><strong>Taxa</strong></TableCell>
                      <TableCell align="right"><strong>Valor Final</strong></TableCell>
                      <TableCell><strong>Status</strong></TableCell>
                      <TableCell><strong>Criado em</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {record.withdrawals.map((withdrawal: any) => (
                      <TableRow key={withdrawal.id}>
                        <TableCell>
                          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
                            {withdrawal.id.substring(0, 8)}...
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(withdrawal.amount)}
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(withdrawal.fee)}
                        </TableCell>
                        <TableCell align="right">
                          {new Intl.NumberFormat('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          }).format(withdrawal.finalAmount)}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={withdrawal.status} 
                            color="success" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          {new Date(withdrawal.createdAt).toLocaleString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            );
          }}
        />
      </SimpleShowLayout>
    </Show>
  );
};

export default MonthlyServiceInvoiceShow;