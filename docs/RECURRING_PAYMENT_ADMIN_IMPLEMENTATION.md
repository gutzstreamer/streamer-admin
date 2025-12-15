# Documentação: Implementação do Admin de Recurring Payment (React Admin)

## 📋 Sumário
1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Modelos e Endpoints](#modelos-e-endpoints)
4. [Componentes a Implementar](#componentes-a-implementar)
5. [Integração com Subscription Plan](#integração-com-subscription-plan)
6. [Guia de Implementação Passo a Passo](#guia-de-implementação-passo-a-passo)

---

## 🎯 Visão Geral

Implementaremos uma interface administrativa completa para gerenciar o sistema de pagamentos recorrentes que foi desenvolvido no backend. O sistema é **polimórfico** e permite criar preços recorrentes para qualquer tipo de recurso (planos de assinatura, memberships, features premium, etc).

### Recursos Principais:
- **RecurringPaymentPricing**: CRUD completo para criar e gerenciar preços recorrentes
- **RecurringPaymentSubscription**: Visualização de assinaturas ativas (lista e detalhes)
- **RecurringPaymentTransaction**: Visualização de transações (lista e detalhes)
- **Integração**: Vincular pricing aos Subscription Plans existentes

---

## 📁 Estrutura de Arquivos

```
src/
└── components/
    ├── subscription-plan/                    # [EXISTENTE - MODIFICAR]
    │   ├── SubScriptionPlanCreate.tsx       # Adicionar seção de pricing
    │   ├── SubScriptionPlanEdit.tsx         # Adicionar seção de pricing
    │   ├── SubScriptionPlanShow.tsx         # Adicionar visualização de pricing
    │   └── SubscriptionPlanListCopy.tsx     # [Sem alterações]
    │
    ├── recurring-payment-pricing/            # [NOVO]
    │   ├── RecurringPaymentPricingCreate.tsx
    │   ├── RecurringPaymentPricingEdit.tsx
    │   ├── RecurringPaymentPricingShow.tsx
    │   ├── RecurringPaymentPricingList.tsx
    │   └── index.ts                         # Exports
    │
    ├── recurring-payment-subscription/       # [NOVO]
    │   ├── RecurringPaymentSubscriptionList.tsx
    │   ├── RecurringPaymentSubscriptionShow.tsx
    │   └── index.ts
    │
    └── recurring-payment-transaction/        # [NOVO]
        ├── RecurringPaymentTransactionList.tsx
        ├── RecurringPaymentTransactionShow.tsx
        └── index.ts
```

---

## 🔌 Modelos e Endpoints

### 1. RecurringPaymentPricing (Resource: `recurring-payment-pricing`)

#### Campos do Modelo:
```typescript
{
  id: string;
  resourceType: 'SUBSCRIPTION_PLAN' | 'STREAMER_MEMBERSHIP' | 'PREMIUM_FEATURE' | 'CUSTOM';
  resourceId: string | null;  // ID do SubscriptionPlan (quando resourceType = 'SUBSCRIPTION_PLAN')
  name: string;               // Ex: "Plano Premium - Mensal"
  description: string | null; // Ex: "Cobrança mensal do plano premium"
  amount: number;             // Valor em centavos (ex: 4990 = R$ 49,90)
  interval: 'MONTHLY' | 'QUARTERLY' | 'YEARLY';
  metadata: object | null;    // Dados adicionais em JSON
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Endpoints Esperados:
- `GET /recurring-payment-pricing/all` - Listar todos
- `GET /recurring-payment-pricing/:id` - Buscar por ID
- `POST /recurring-payment-pricing` - Criar novo
- `PUT /recurring-payment-pricing/:id` - Atualizar
- `DELETE /recurring-payment-pricing/:id` - Deletar (soft delete recomendado)

---

### 2. RecurringPaymentSubscription (Resource: `recurring-payment-subscription`)

#### Campos do Modelo:
```typescript
{
  id: string;
  userId: string;
  pricingId: string;
  status: 'ACTIVE' | 'PENDING' | 'CANCELED' | 'SUSPENDED';
  paymentDueDate: Date;
  nextPaymentDate: Date | null;
  metadata: object | null;
  createdAt: Date;
  updatedAt: Date;
  canceledAt: Date | null;
  
  // Relações populadas
  user: { id: string; name: string; email: string; };
  pricing: RecurringPaymentPricing;
}
```

#### Endpoints Esperados:
- `GET /recurring-payment-subscription/all` - Listar todos
- `GET /recurring-payment-subscription/:id` - Buscar por ID
- **Operações**: Apenas visualização (read-only), cancelamento via ação customizada

---

### 3. RecurringPaymentTransaction (Resource: `recurring-payment-transaction`)

#### Campos do Modelo:
```typescript
{
  id: string;
  subscriptionId: string;
  amount: number;
  status: 'PENDING' | 'CONFIRMED' | 'FAILED' | 'CANCELED';
  paymentMethod: string;
  transactionId: string | null;
  errorMessage: string | null;
  metadata: object | null;
  createdAt: Date;
  updatedAt: Date;
  
  // Relações
  subscription: RecurringPaymentSubscription;
}
```

#### Endpoints Esperados:
- `GET /recurring-payment-transaction/all` - Listar todos
- `GET /recurring-payment-transaction/:id` - Buscar por ID
- **Operações**: Apenas visualização (read-only)

---

## 🧩 Componentes a Implementar

### 1. RecurringPaymentPricing (CRUD Completo)

#### **RecurringPaymentPricingList.tsx**
```tsx
import { List, Datagrid, TextField, NumberField, BooleanField, DateField, SelectField } from "react-admin";

const intervalChoices = [
  { id: 'MONTHLY', name: 'Mensal' },
  { id: 'QUARTERLY', name: 'Trimestral' },
  { id: 'YEARLY', name: 'Anual' },
];

const resourceTypeChoices = [
  { id: 'SUBSCRIPTION_PLAN', name: 'Plano de Assinatura' },
  { id: 'STREAMER_MEMBERSHIP', name: 'Membership de Streamer' },
  { id: 'PREMIUM_FEATURE', name: 'Feature Premium' },
  { id: 'CUSTOM', name: 'Personalizado' },
];

export const RecurringPaymentPricingList = (props) => (
  <List {...props} filters={[
    <SelectInput source="resourceType" choices={resourceTypeChoices} alwaysOn />,
    <SelectInput source="interval" choices={intervalChoices} alwaysOn />,
    <BooleanInput source="isActive" alwaysOn />
  ]}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      <TextField source="name" />
      <SelectField source="resourceType" choices={resourceTypeChoices} />
      <SelectField source="interval" choices={intervalChoices} />
      <NumberField 
        source="amount" 
        options={{ style: 'currency', currency: 'BRL' }}
        transform={(value) => value / 100}  // Converte centavos para reais
      />
      <BooleanField source="isActive" />
      <DateField source="createdAt" showTime />
    </Datagrid>
  </List>
);
```

**Características:**
- Filtros por `resourceType`, `interval` e `isActive`
- Formata o valor em BRL (divide por 100 para converter centavos)
- SelectField para enums traduzidos em PT-BR

---

#### **RecurringPaymentPricingCreate.tsx**
```tsx
import {
  Create,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  ReferenceInput,
  required,
} from "react-admin";

const intervalChoices = [
  { id: 'MONTHLY', name: 'Mensal' },
  { id: 'QUARTERLY', name: 'Trimestral' },
  { id: 'YEARLY', name: 'Anual' },
];

const resourceTypeChoices = [
  { id: 'SUBSCRIPTION_PLAN', name: 'Plano de Assinatura' },
  { id: 'STREAMER_MEMBERSHIP', name: 'Membership de Streamer' },
  { id: 'PREMIUM_FEATURE', name: 'Feature Premium' },
  { id: 'CUSTOM', name: 'Personalizado' },
];

export const RecurringPaymentPricingCreate = (props) => (
  <Create {...props}>
    <SimpleForm>
      {/* Tipo de Recurso */}
      <SelectInput 
        source="resourceType" 
        choices={resourceTypeChoices} 
        validate={required()}
        defaultValue="SUBSCRIPTION_PLAN"
      />
      
      {/* Vincular ao Subscription Plan (condicional) */}
      <ReferenceInput 
        source="resourceId" 
        reference="subscription-plan"
        label="Plano de Assinatura"
      >
        <SelectInput optionText="name" />
      </ReferenceInput>
      
      {/* Informações do Preço */}
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />
      
      {/* Valor em REAIS (converter para centavos no transform) */}
      <NumberInput 
        source="amount" 
        label="Valor (R$)" 
        validate={required()}
        format={(v) => v / 100}       // Backend -> Frontend (centavos -> reais)
        parse={(v) => Math.round(v * 100)} // Frontend -> Backend (reais -> centavos)
      />
      
      {/* Intervalo de Cobrança */}
      <SelectInput 
        source="interval" 
        choices={intervalChoices} 
        validate={required()}
        defaultValue="MONTHLY"
      />
      
      {/* Status */}
      <BooleanInput source="isActive" defaultValue={true} />
    </SimpleForm>
  </Create>
);
```

**Características:**
- **Conversão automática** de centavos ↔ reais via `format`/`parse`
- **ReferenceInput** para vincular ao `subscription-plan` (quando `resourceType = 'SUBSCRIPTION_PLAN'`)
- Validação com `required()` nos campos obrigatórios
- Valores default para campos comuns

---

#### **RecurringPaymentPricingEdit.tsx**
```tsx
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  SelectInput,
  BooleanInput,
  ReferenceInput,
  required,
} from "react-admin";

// [Mesmos choices de Create]

export const RecurringPaymentPricingEdit = (props) => (
  <Edit {...props}>
    <SimpleForm>
      {/* Tipo de Recurso (disabled - não deve ser editado) */}
      <SelectInput 
        source="resourceType" 
        choices={resourceTypeChoices} 
        disabled
      />
      
      {/* Resource ID (disabled) */}
      <TextInput source="resourceId" disabled />
      
      {/* Informações Editáveis */}
      <TextInput source="name" validate={required()} />
      <TextInput source="description" multiline rows={3} />
      
      <NumberInput 
        source="amount" 
        label="Valor (R$)" 
        validate={required()}
        format={(v) => v / 100}
        parse={(v) => Math.round(v * 100)}
      />
      
      <SelectInput 
        source="interval" 
        choices={intervalChoices} 
        validate={required()}
      />
      
      <BooleanInput source="isActive" />
    </SimpleForm>
  </Edit>
);
```

**Diferenças do Create:**
- `resourceType` e `resourceId` são **desabilitados** (não devem ser alterados após criação)
- Demais campos editáveis normalmente

---

#### **RecurringPaymentPricingShow.tsx**
```tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  BooleanField,
  DateField,
  ReferenceField,
  SelectField,
} from "react-admin";

// [Mesmos choices]

export const RecurringPaymentPricingShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      
      {/* Tipo e Recurso */}
      <SelectField source="resourceType" choices={resourceTypeChoices} />
      <ReferenceField source="resourceId" reference="subscription-plan" link="show">
        <TextField source="name" />
      </ReferenceField>
      
      {/* Detalhes do Preço */}
      <TextField source="name" />
      <TextField source="description" />
      <NumberField 
        source="amount"
        options={{ style: 'currency', currency: 'BRL' }}
        transform={(value) => value / 100}
      />
      <SelectField source="interval" choices={intervalChoices} />
      
      {/* Status */}
      <BooleanField source="isActive" />
      
      {/* Datas */}
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);
```

---

### 2. RecurringPaymentSubscription (Read-Only)

#### **RecurringPaymentSubscriptionList.tsx**
```tsx
import { 
  List, 
  Datagrid, 
  TextField, 
  ReferenceField,
  DateField,
  SelectField,
  NumberField,
  FunctionField,
} from "react-admin";

const statusChoices = [
  { id: 'ACTIVE', name: 'Ativa' },
  { id: 'PENDING', name: 'Pendente' },
  { id: 'CANCELED', name: 'Cancelada' },
  { id: 'SUSPENDED', name: 'Suspensa' },
];

export const RecurringPaymentSubscriptionList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      
      {/* Usuário */}
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
      
      {/* Pricing */}
      <ReferenceField source="pricingId" reference="recurring-payment-pricing" link="show">
        <TextField source="name" />
      </ReferenceField>
      
      {/* Status */}
      <SelectField source="status" choices={statusChoices} />
      
      {/* Datas */}
      <DateField source="nextPaymentDate" />
      <DateField source="createdAt" />
      
      {/* Valor */}
      <FunctionField 
        label="Valor" 
        render={(record) => (
          <NumberField 
            record={{ amount: record.pricing?.amount || 0 }}
            source="amount"
            options={{ style: 'currency', currency: 'BRL' }}
            transform={(v) => v / 100}
          />
        )}
      />
    </Datagrid>
  </List>
);
```

---

#### **RecurringPaymentSubscriptionShow.tsx**
```tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  ReferenceField,
  DateField,
  SelectField,
  NumberField,
  ReferenceManyField,
  Datagrid,
} from "react-admin";

const statusChoices = [
  { id: 'ACTIVE', name: 'Ativa' },
  { id: 'PENDING', name: 'Pendente' },
  { id: 'CANCELED', name: 'Cancelada' },
  { id: 'SUSPENDED', name: 'Suspensa' },
];

export const RecurringPaymentSubscriptionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      
      {/* Usuário */}
      <ReferenceField source="userId" reference="users" link="show">
        <TextField source="name" />
      </ReferenceField>
      
      {/* Pricing */}
      <ReferenceField source="pricingId" reference="recurring-payment-pricing" link="show">
        <TextField source="name" />
      </ReferenceField>
      
      {/* Status e Datas */}
      <SelectField source="status" choices={statusChoices} />
      <DateField source="paymentDueDate" showTime />
      <DateField source="nextPaymentDate" showTime />
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
      <DateField source="canceledAt" showTime />
      
      {/* Histórico de Transações */}
      <ReferenceManyField 
        label="Transações" 
        reference="recurring-payment-transaction"
        target="subscriptionId"
      >
        <Datagrid rowClick="show">
          <TextField source="id" />
          <NumberField 
            source="amount"
            options={{ style: 'currency', currency: 'BRL' }}
            transform={(v) => v / 100}
          />
          <SelectField 
            source="status" 
            choices={[
              { id: 'PENDING', name: 'Pendente' },
              { id: 'CONFIRMED', name: 'Confirmado' },
              { id: 'FAILED', name: 'Falhou' },
              { id: 'CANCELED', name: 'Cancelado' },
            ]}
          />
          <DateField source="createdAt" showTime />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);
```

**Características:**
- **ReferenceManyField**: Mostra todas as transações da assinatura
- **Links**: Clique em user/pricing redireciona para detalhes

---

### 3. RecurringPaymentTransaction (Read-Only)

#### **RecurringPaymentTransactionList.tsx**
```tsx
import { 
  List, 
  Datagrid, 
  TextField, 
  NumberField,
  DateField,
  SelectField,
  ReferenceField,
} from "react-admin";

const statusChoices = [
  { id: 'PENDING', name: 'Pendente' },
  { id: 'CONFIRMED', name: 'Confirmado' },
  { id: 'FAILED', name: 'Falhou' },
  { id: 'CANCELED', name: 'Cancelado' },
];

export const RecurringPaymentTransactionList = (props) => (
  <List {...props}>
    <Datagrid rowClick="show">
      <TextField source="id" />
      
      {/* Subscription */}
      <ReferenceField source="subscriptionId" reference="recurring-payment-subscription" link="show">
        <TextField source="id" />
      </ReferenceField>
      
      {/* Valor */}
      <NumberField 
        source="amount"
        options={{ style: 'currency', currency: 'BRL' }}
        transform={(v) => v / 100}
      />
      
      {/* Status */}
      <SelectField source="status" choices={statusChoices} />
      
      {/* Data */}
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </Datagrid>
  </List>
);
```

---

#### **RecurringPaymentTransactionShow.tsx**
```tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  DateField,
  SelectField,
  ReferenceField,
} from "react-admin";

const statusChoices = [
  { id: 'PENDING', name: 'Pendente' },
  { id: 'CONFIRMED', name: 'Confirmado' },
  { id: 'FAILED', name: 'Falhou' },
  { id: 'CANCELED', name: 'Cancelado' },
];

export const RecurringPaymentTransactionShow = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      <TextField source="id" />
      
      {/* Subscription */}
      <ReferenceField source="subscriptionId" reference="recurring-payment-subscription" link="show">
        <TextField source="id" />
      </ReferenceField>
      
      {/* Detalhes da Transação */}
      <NumberField 
        source="amount"
        options={{ style: 'currency', currency: 'BRL' }}
        transform={(v) => v / 100}
      />
      <SelectField source="status" choices={statusChoices} />
      <TextField source="paymentMethod" />
      <TextField source="transactionId" />
      <TextField source="errorMessage" />
      
      {/* Datas */}
      <DateField source="createdAt" showTime />
      <DateField source="updatedAt" showTime />
    </SimpleShowLayout>
  </Show>
);
```

---

## 🔗 Integração com Subscription Plan

### Modificações em SubScriptionPlanShow.tsx

Adicionar seção para exibir os preços recorrentes vinculados ao plano:

```tsx
import {
  Show,
  SimpleShowLayout,
  TextField,
  NumberField,
  ReferenceManyField,
  Datagrid,
  SelectField,
  BooleanField,
} from "react-admin";

const intervalChoices = [
  { id: 'MONTHLY', name: 'Mensal' },
  { id: 'QUARTERLY', name: 'Trimestral' },
  { id: 'YEARLY', name: 'Anual' },
];

const SubscriptionPlanShow: React.FC = (props) => (
  <Show {...props}>
    <SimpleShowLayout>
      {/* Campos Existentes */}
      <TextField source="id" />
      <TextField source="name" />
      <TextField source="description" />
      <NumberField source="price" />
      <NumberField source="duration" />
      <NumberField source="donationFee" />
      <NumberField source="donationWithDrawallFee" />
      <NumberField source="donationWithDrawallLimit" />
      <NumberField source="marketWithDrawallFee" />
      <NumberField source="marketWithDrawallLimit" />
      
      {/* NOVO: Seção de Preços Recorrentes */}
      <ReferenceManyField 
        label="Preços Recorrentes" 
        reference="recurring-payment-pricing"
        target="resourceId"
        filter={{ resourceType: 'SUBSCRIPTION_PLAN' }}
      >
        <Datagrid rowClick="show">
          <TextField source="name" />
          <SelectField source="interval" choices={intervalChoices} />
          <NumberField 
            source="amount"
            options={{ style: 'currency', currency: 'BRL' }}
            transform={(v) => v / 100}
          />
          <BooleanField source="isActive" />
        </Datagrid>
      </ReferenceManyField>
    </SimpleShowLayout>
  </Show>
);

export default SubscriptionPlanShow;
```

**Nota**: O `ReferenceManyField` buscará automaticamente todos os `RecurringPaymentPricing` onde:
- `resourceId = <planId>` (do plano atual)
- `resourceType = 'SUBSCRIPTION_PLAN'`

---

### Modificações em SubScriptionPlanEdit.tsx e Create.tsx (Opcional)

Se quiser permitir criar preços diretamente no formulário do plano, use `ArrayInput`:

```tsx
import {
  Edit,
  SimpleForm,
  TextInput,
  NumberInput,
  ArrayInput,
  SimpleFormIterator,
  SelectInput,
  BooleanInput,
} from "react-admin";

const intervalChoices = [
  { id: 'MONTHLY', name: 'Mensal' },
  { id: 'QUARTERLY', name: 'Trimestral' },
  { id: 'YEARLY', name: 'Anual' },
];

const SubscriptionPlanEdit: React.FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      {/* Campos Existentes */}
      <TextInput source="name" />
      <TextInput source="description" />
      <NumberInput source="price" />
      <NumberInput source="duration" />
      <NumberInput source="donationFee" />
      <NumberInput source="donationWithDrawallFee" />
      <NumberInput source="donationWithDrawallLimit" />
      <NumberInput source="marketWithDrawallFee" />
      <NumberInput source="marketWithDrawallLimit" />
      
      {/* NOVO: Seção de Preços Recorrentes */}
      <ArrayInput source="recurringPricing" label="Preços Recorrentes">
        <SimpleFormIterator>
          <TextInput source="name" label="Nome do Preço" />
          <NumberInput 
            source="amount" 
            label="Valor (R$)"
            format={(v) => v / 100}
            parse={(v) => Math.round(v * 100)}
          />
          <SelectInput source="interval" choices={intervalChoices} />
          <BooleanInput source="isActive" defaultValue={true} />
        </SimpleFormIterator>
      </ArrayInput>
    </SimpleForm>
  </Edit>
);

export default SubscriptionPlanEdit;
```

**Nota**: Isso requer que o backend aceite um array `recurringPricing` no payload e crie/atualize os registros automaticamente. Se não, prefira criar os preços separadamente no CRUD de `RecurringPaymentPricing`.

---

## 📝 Guia de Implementação Passo a Passo

### **Passo 1: Criar estrutura de pastas**
```bash
cd src/components
mkdir recurring-payment-pricing recurring-payment-subscription recurring-payment-transaction
```

### **Passo 2: Implementar RecurringPaymentPricing**
1. Criar `RecurringPaymentPricingList.tsx`
2. Criar `RecurringPaymentPricingCreate.tsx`
3. Criar `RecurringPaymentPricingEdit.tsx`
4. Criar `RecurringPaymentPricingShow.tsx`
5. Criar `index.ts` com exports

### **Passo 3: Implementar RecurringPaymentSubscription**
1. Criar `RecurringPaymentSubscriptionList.tsx`
2. Criar `RecurringPaymentSubscriptionShow.tsx`
3. Criar `index.ts`

### **Passo 4: Implementar RecurringPaymentTransaction**
1. Criar `RecurringPaymentTransactionList.tsx`
2. Criar `RecurringPaymentTransactionShow.tsx`
3. Criar `index.ts`

### **Passo 5: Registrar Resources no App.tsx**

Adicionar após o resource `subscription-plan`:

```tsx
import { Repeat, Payment, Receipt } from "@mui/icons-material";
import {
  RecurringPaymentPricingList,
  RecurringPaymentPricingCreate,
  RecurringPaymentPricingEdit,
  RecurringPaymentPricingShow,
} from "./components/recurring-payment-pricing";
import {
  RecurringPaymentSubscriptionList,
  RecurringPaymentSubscriptionShow,
} from "./components/recurring-payment-subscription";
import {
  RecurringPaymentTransactionList,
  RecurringPaymentTransactionShow,
} from "./components/recurring-payment-transaction";

// Dentro do <Admin>:
<Resource
  options={{ label: "Preços Recorrentes" }}
  name="recurring-payment-pricing"
  icon={Repeat}
  list={RecurringPaymentPricingList}
  create={RecurringPaymentPricingCreate}
  edit={RecurringPaymentPricingEdit}
  show={RecurringPaymentPricingShow}
/>
<Resource
  options={{ label: "Assinaturas Recorrentes" }}
  name="recurring-payment-subscription"
  icon={Payment}
  list={RecurringPaymentSubscriptionList}
  show={RecurringPaymentSubscriptionShow}
/>
<Resource
  options={{ label: "Transações Recorrentes" }}
  name="recurring-payment-transaction"
  icon={Receipt}
  list={RecurringPaymentTransactionList}
  show={RecurringPaymentTransactionShow}
/>
```

### **Passo 6: Atualizar SubScriptionPlanShow.tsx**
Adicionar `ReferenceManyField` para exibir preços vinculados (código já fornecido acima).

### **Passo 7: Testar endpoints no backend**
Verificar se os seguintes endpoints existem e retornam dados no formato esperado:
- `GET /recurring-payment-pricing/all`
- `GET /recurring-payment-subscription/all`
- `GET /recurring-payment-transaction/all`

---

## ✅ Checklist de Implementação

- [ ] Criar pasta `recurring-payment-pricing` com 4 componentes + index
- [ ] Criar pasta `recurring-payment-subscription` com 2 componentes + index
- [ ] Criar pasta `recurring-payment-transaction` com 2 componentes + index
- [ ] Adicionar 3 Resources no App.tsx
- [ ] Modificar SubScriptionPlanShow.tsx para exibir preços vinculados
- [ ] Testar criação de pricing via admin
- [ ] Testar vinculação de pricing com subscription plan
- [ ] Verificar formatação de valores (centavos ↔ reais)
- [ ] Testar filtros e ordenação nas listas
- [ ] Verificar navegação entre resources (links de referência)

---

## 🎨 Padrões de Código React Admin

### Conversão de Valores (Centavos ↔ Reais)
```tsx
// No formulário (Create/Edit):
<NumberInput 
  source="amount" 
  label="Valor (R$)"
  format={(v) => v / 100}       // Backend → Frontend
  parse={(v) => Math.round(v * 100)} // Frontend → Backend
/>

// Na listagem/show:
<NumberField 
  source="amount"
  options={{ style: 'currency', currency: 'BRL' }}
  transform={(value) => value / 100}
/>
```

### ReferenceInput para Vincular Recursos
```tsx
<ReferenceInput source="resourceId" reference="subscription-plan">
  <SelectInput optionText="name" />
</ReferenceInput>
```

### ReferenceManyField para Listar Relacionamentos
```tsx
<ReferenceManyField 
  reference="recurring-payment-pricing"
  target="resourceId"
  filter={{ resourceType: 'SUBSCRIPTION_PLAN' }}
>
  <Datagrid rowClick="show">
    {/* campos */}
  </Datagrid>
</ReferenceManyField>
```

### Filtros na Lista
```tsx
<List filters={[
  <SelectInput source="status" choices={statusChoices} alwaysOn />,
  <BooleanInput source="isActive" alwaysOn />
]}>
  {/* ... */}
</List>
```

---

## 🚀 Próximos Passos

Após implementar o admin, considerar:
1. **Ações customizadas**: Botão "Cancelar Assinatura" no show de subscription
2. **Dashboard**: Widget com KPIs (total de assinaturas ativas, MRR, churn rate)
3. **Notificações**: Toast de sucesso/erro nas operações
4. **Validações avançadas**: Validar que o `resourceId` existe quando `resourceType = 'SUBSCRIPTION_PLAN'`
5. **Permissões**: Restringir edição/exclusão de pricing com assinaturas ativas

---

## 📚 Referências

- [React Admin Documentation](https://marmelab.com/react-admin/)
- [Backend: RECURRING_PAYMENT_POLYMORPHIC_ARCHITECTURE.md](../../streamer-backend/docs/RECURRING_PAYMENT_POLYMORPHIC_ARCHITECTURE.md)
- [Backend: RECURRING_PAYMENT_USAGE_EXAMPLE.md](../../streamer-backend/docs/RECURRING_PAYMENT_USAGE_EXAMPLE.md)
- [Prisma Schema](../../streamer-backend/prisma/schema.prisma)

---

**Documento criado em:** 2025  
**Versão:** 1.0  
**Autor:** AI Assistant + Paulo Leite
