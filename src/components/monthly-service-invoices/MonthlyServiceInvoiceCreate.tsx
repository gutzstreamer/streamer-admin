import React, { useState } from "react";
import {
  Create,
  SimpleForm,
  ReferenceInput,
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
} from "@mui/material";
import { Receipt as ReceiptIcon, Warning as WarningIcon } from "@mui/icons-material";

const MonthlyServiceInvoiceCreate: React.FC = (props) => {
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [formData, setFormData] = useState<any>(null);
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

  const handleSubmit = (data: any) => {
    setFormData(data);
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    if (!formData) return;

    setLoading(true);
    try {
      await dataProvider.create("monthly-service-invoices", {
        data: formData,
      });

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
            <SelectInput optionText="name" optionValue="id" validate={required()} />
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
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="warning" />
            Confirmar Geração de Nota Fiscal
          </Box>
        </DialogTitle>
        <DialogContent>
          {formData && (
            <Box>
              <Typography variant="body1" gutterBottom>
                Você está prestes a gerar uma nota fiscal mensal com os seguintes dados:
              </Typography>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: "grey.100", borderRadius: 1 }}>
                <Typography><strong>Período:</strong> {getMonthName(formData.month)}/{formData.year}</Typography>
                <Typography><strong>Streamer ID:</strong> {formData.streamerId}</Typography>
              </Box>

              <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
                ⚠️ Esta ação irá:
              </Typography>
              <ul style={{ margin: "8px 0", paddingLeft: "20px" }}>
                <li>Buscar todos os saques aprovados do período</li>
                <li>Calcular os totais e taxas</li>
                <li>Gerar a nota fiscal de serviço</li>
                <li>Enviar para a API externa</li>
                <li>Notificar o streamer por e-mail</li>
              </ul>
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
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <ReceiptIcon />}
          >
            {loading ? "Gerando..." : "Confirmar Geração"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MonthlyServiceInvoiceCreate;