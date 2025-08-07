# Componentes de Upload e Exibição de Imagem - Admin

## 📁 Componentes Criados

### 1. **ImageUpload** (componente base para upload)
- **Localização**: `src/components/common/ImageUpload.tsx`
- **Funcionalidades**:
  - Seleção de arquivos da máquina do usuário
  - Conversão automática para base64
  - Preview de imagens
  - Validação de tipo e tamanho
  - Remoção de imagens
  - Suporte a imagens existentes (URLs do R2)

### 2. **ImageField** (componente base para exibição)
- **Localização**: `src/components/common/ImageField.tsx`
- **Funcionalidades**:
  - Exibição de imagens com dimensões customizáveis
  - Tratamento de erro para imagens quebradas
  - Placeholder quando não há imagem
  - Estilo responsivo com Material-UI

### 3. **ProductImageInput** (para produtos)
- **Localização**: `src/components/products/ProductImageInput.tsx`
- **Integração**: React Admin com useInput
- **Uso**: Substituiu TextInput nas imagens de produtos

### 4. **StreamerImageInput** (para streamers)
- **Localização**: `src/components/streamers/StreamerImageInput.tsx`
- **Integração**: React Admin com useInput
- **Uso**: Substituiu TextInput na imagem do streamer

### 5. **ImageDetails** (para produtos - já existia)
- **Localização**: `src/components/products/ImageDetails.tsx`
- **Funcionalidades**: Exibe imagens de produtos com detalhes de cor e tamanho

## 🚀 Como Usar

### Para Upload (Edit/Create):
```tsx
import ProductImageInput from "./ProductImageInput";
import StreamerImageInput from "./StreamerImageInput";

// Para produtos:
<ProductImageInput source="url" label="Product Image" />

// Para streamers:
<StreamerImageInput source="image" label="Streamer Profile Image" />
```

### Para Exibição (Show):
```tsx
import ImageField from "../common/ImageField";

// Exibir imagem simples:
<ImageField source="image" label="Profile Image" width={150} height={150} />

// Para produtos (usa ImageDetails existente):
<ArrayField source="images">
  <SingleFieldList linkType={false}>
    <ImageDetails />
  </SingleFieldList>
</ArrayField>
```

## ✨ Funcionalidades

### Upload de Imagem:
1. **Clique em "Select Image"** → Abre seletor de arquivos
2. **Selecione uma imagem** → Conversão automática para base64
3. **Preview instantâneo** → Visualização da imagem selecionada
4. **Salvar** → Base64 enviado para o backend

### Exibição de Imagem:
1. **Renderização automática** → URLs do R2 exibidas como imagem
2. **Tratamento de erro** → Fallback quando imagem não carrega
3. **Dimensões customizáveis** → width/height configuráveis
4. **Estilo consistente** → Design unificado com Material-UI

### Validações:
- ✅ **Tipo**: Apenas arquivos de imagem
- ✅ **Tamanho**: Máximo 5MB (configurável)
- ✅ **Preview**: Mostra imagem antes do upload
- ✅ **Fallback**: Mensagem quando imagem não existe

## 📋 Arquivos Atualizados

### Para Upload:
- ✅ **ProductEdit.tsx** → Usa ProductImageInput
- ✅ **ProductCreate.tsx** → Usa ProductImageInput  
- ✅ **StreamerEdit.tsx** → Usa StreamerImageInput

### Para Exibição:
- ✅ **StreamerShow.tsx** → Usa ImageField para foto do perfil
- ✅ **ProductShow.tsx** → Usa ImageDetails (já existia)

## 🔄 Fluxo Completo

### Upload:
1. **Admin seleciona imagem** → Conversão para base64
2. **Envio para backend** → Base64 no payload
3. **Backend processa** → Upload automático para R2
4. **Resposta** → URL pública do R2
5. **Banco de dados** → Armazena URL (não base64)

### Exibição:
1. **Carregamento dos dados** → URL do R2 vem do backend
2. **Renderização** → ImageField/ImageDetails exibe a imagem
3. **Fallback** → Mensagem de erro se não carregar

## 🎯 Resultado

- 📱 **UX melhorada**: Interface visual para upload e exibição
- 🖼️ **Preview visual**: Visualização de imagens nos formulários e shows
- 🚀 **Performance**: Sem URLs quebradas ou base64 no banco
- 🌐 **CDN**: Imagens servidas via R2 custom domain
- 🔒 **Validação**: Controle de tipo e tamanho de arquivo
- 🎨 **Design consistente**: Estilo unificado em toda a aplicação
