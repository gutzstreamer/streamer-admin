import React, { useState } from "react";
import {
  Create,
  SimpleForm,
  ReferenceInput,
  AutocompleteInput,
  SelectInput,
  useNotify,
  useRedirect,
  useDataProvider,
  required,
} from "react-admin";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  CircularProgress,
  Box,
  Card,
  CardContent,
  Divider,
  Alert,
  Chip,
} from "@mui/material";
import {
  Receipt as ReceiptIcon,
  Warning as WarningIcon,
  Preview as PreviewIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material";

interface SimulationData {
  type: 'PF' | 'PJ';
  streamerId: string;
  streamerName: string;
  year: number;
  month: number;
  monthName: string;
  totalAmount: number;
  totalFee: number;
  netAmount: number;
  withdrawalCount: number;
  invoiceDescription: string;
  streamerEmail: string;
  streamerIdentityNumber: string;
  alreadyExists: boolean;
}

const MonthlyServiceInvoiceCreate: React.FC = (props) => {
  const [loading, setLoading] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const [simulationData, setSimulationData] = useState<SimulationData[] | null>(null);
  const notify = useNotify();
  const redirect = useRedirect();
  const dataProvider = useDataProvider();

  const monthOptions = [
    { id: 1, name: "Janeiro" },
    { id: 2, name: "Fevereiro" },
    { id: 3, name: "Março" },
    { id: 4, name: "Abril" },
    { id: 5, name: "Maio" },
    { id: 6, name: "Junho" },
    { id: 7, name: "Julho" },
    { id: 8, name: "Agosto" },
    { id: 9, name: "Setembro" },
    { id: 10, name: "Outubro" },
    { id: 11, name: "Novembro" },
    { id: 12, name: "Dezembro" },
  ];

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 5 }, (_, i) => ({
    id: currentYear - i,
    name: (currentYear - i).toString(),
  }));

  const handleSubmit = async (data: any) => {
    setFormData(data);
    
    // Primeiro simular
    setSimulating(true);
    try {
      const result = await (dataProvider as any).simulateMonthlyInvoice(
        data.year,
        data.month,
        data.streamerId,
      );

      setSimulationData(result.data);
      setConfirmOpen(true);
    } catch (error: any) {
      notify(
        `Erro ao simular nota fiscal: ${error.message || "Erro desconhecido"}`,
        { type: "error" }
      );
    } finally {
      setSimulating(false);
    }
  };

  const handleConfirm = async () => {
    if (!formData) return;

    setLoading(true);
    try {
      await (dataProvider as any).createMonthlyInvoice(
        formData.year,
        formData.month,
        formData.streamerId,
      );

      notify(
        `Nota fiscal mensal gerada com sucesso para o mês ${formData.month}/${formData.year}`,
        { type: "success" }
      );
      
      redirect("list", "monthly-service-invoices");
    } catch (error: any) {
      notify(
        `Erro ao gerar nota fiscal: ${error.message || "Erro desconhecido"}`,
        { type: "error" }
      );
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  const getMonthName = (month: number) => {
    return monthOptions.find(m => m.id === month)?.name || month.toString();
  };

  return (
    <>
      <Create {...props} title="Gerar Nota Fiscal Mensal">
        <SimpleForm onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            📄 Gerar Nota Fiscal de Serviço Mensal
          </Typography>
          
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Esta ação irá processar todos os saques aprovados do streamer no período
            selecionado e gerar a nota fiscal de serviço correspondente.
          </Typography>

          <ReferenceInput
            source="streamerId"
            reference="streamers"
            label="Streamer"
          >
            <AutocompleteInput 
              optionText="name" 
              optionValue="id" 
              validate={required()}
              filterToQuery={searchText => ({ name: searchText })}
            />
          </ReferenceInput>

          <SelectInput
            source="year"
            label="Ano"
            choices={yearOptions}
            validate={required()}
            defaultValue={currentYear}
          />

          <SelectInput
            source="month"
            label="Mês"
            choices={monthOptions}
            validate={required()}
            defaultValue={new Date().getMonth() + 1}
          />
        </SimpleForm>
      </Create>

      {/* Modal de Confirmação */}
      <Dialog open={confirmOpen} onClose={() => !loading && setConfirmOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <PreviewIcon color="primary" />
            Simulação da Nota Fiscal Mensal
          </Box>
        </DialogTitle>
        <DialogContent>
          {formData && simulationData && (
            <Box>
              {simulationData.some(s => s.alreadyExists) && (
                <Alert severity="warning" sx={{ mb: 2 }}>
                  ⚠️ Já existe uma nota fiscal gerada para este streamer no período selecionado!
                </Alert>
              )}

              <Typography variant="body1" gutterBottom fontWeight="bold">
                Resumo do Período: {simulationData[0]?.monthName}/{simulationData[0]?.year}
              </Typography>

              {simulationData.map((simulation, index) => (
                <Card key={index} sx={{ mt: 2, border: 2, borderColor: simulation.type === 'PF' ? 'primary.main' : 'secondary.main' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6">
                        {simulation.streamerName}
                      </Typography>
                      <Chip 
                        label={simulation.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        color={simulation.type === 'PF' ? 'primary' : 'secondary'}
                      />
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      📄 Valor da Nota Fiscal (Taxas de Serviço)
                    </Typography>
                    <Typography variant="h5" color="primary" gutterBottom fontWeight="bold">
                      R$ {simulation.totalFee.toFixed(2).replace('.', ',')}
                    </Typography>

                    <Divider sx={{ my: 2 }} />

                    <Box sx={{ bgcolor: 'action.hover', p: 2, borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        <strong>🔢 Quantidade de saques:</strong> {simulation.withdrawalCount}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>💵 Total dos saques processados:</strong> R$ {simulation.totalAmount.toFixed(2).replace('.', ',')}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>✅ Valor líquido recebido:</strong> R$ {simulation.netAmount.toFixed(2).replace('.', ',')}
                      </Typography>
                    </Box>

                    <Box sx={{ mt: 2, p: 1.5, bgcolor: 'info.lighter', borderRadius: 1, border: 1, borderColor: 'info.main' }}>
                      <Typography variant="caption" display="block">
                        <strong>📧 E-mail:</strong> {simulation.streamerEmail}
                      </Typography>
                      <Typography variant="caption" display="block">
                        <strong>🆔 {simulation.type === 'PF' ? 'CPF' : 'CNPJ'}:</strong> {simulation.streamerIdentityNumber}
                      </Typography>
                    </Box>

                    <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 2, fontStyle: 'italic' }}>
                      {simulation.invoiceDescription}
                    </Typography>
                  </CardContent>
                </Card>
              ))}

              <Alert severity="info" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  <strong>ℹ️ Esta ação irá:</strong>
                </Typography>
                <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                  <li>Gerar {simulationData.length} nota(s) fiscal(is) de serviço</li>
                  <li>Enviar para a API externa (Spedy)</li>
                  <li>Notificar o streamer por e-mail</li>
                  <li>Vincular os saques à nota fiscal</li>
                </ul>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={loading || simulationData?.some(s => s.alreadyExists)}
            startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
          >
            {loading ? "Gerando..." : "Confirmar e Gerar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MonthlyServiceInvoiceCreate;