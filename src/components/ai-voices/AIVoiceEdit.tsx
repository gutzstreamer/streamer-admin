import {
  Edit,
  SimpleForm,
  TextInput,
  BooleanInput,
  SelectInput,
} from "react-admin";
import React from "react";

const categoryChoices = [
  { id: "generated", name: "Generated" },
  { id: "cloned", name: "Cloned" },
  { id: "professional", name: "Professional" },
  { id: "premade", name: "Premade" },
  { id: "famous", name: "Famous" },
  { id: "high_quality", name: "High Quality" },
  { id: "custom", name: "Custom" },
];

const languageChoices = [
  { id: "pt-BR", name: "Português (Brasil)" },
  { id: "en", name: "English" },
  { id: "es", name: "Español" },
  { id: "fr", name: "Français" },
  { id: "de", name: "Deutsch" },
  { id: "it", name: "Italiano" },
];

const AIVoiceEdit: React.FC = (props) => (
  <Edit {...props}>
    <SimpleForm>
      <TextInput source="name" label="Nome" />
      <TextInput source="description" label="Descrição" multiline rows={3} />
      <SelectInput
        source="category"
        label="Categoria"
        choices={categoryChoices}
      />
      <SelectInput
        source="language"
        label="Idioma"
        choices={languageChoices}
      />
      <TextInput source="thumbnailUrl" label="URL da Thumbnail" fullWidth />
      <TextInput source="previewUrl" label="URL do Preview" fullWidth />
      <TextInput source="salesPreviewUrl" label="URL Preview Vendas" fullWidth />
      <TextInput source="donationPreviewUrl" label="URL Preview Doações" fullWidth />
      <BooleanInput source="isActive" label="Ativa" />
      <BooleanInput source="isPremium" label="Premium" />
    </SimpleForm>
  </Edit>
);

export default AIVoiceEdit;
