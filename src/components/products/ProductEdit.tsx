import React, { useEffect, useState } from "react";
import {
  Edit,
  TextInput,
  NumberInput,
  SelectInput,
  ArrayInput,
  SimpleFormIterator,
  required,
  BooleanInput,
  ArrayField,
  SingleFieldList,
  ChipField,
  TabbedForm,
  FormTab,
  ReferenceInput,
  ReferenceField,
  ReferenceArrayInput,
  SelectArrayInput,
} from "react-admin";
import ProductImageInput from "./ProductImageInput";
import { Button, Card, CardContent } from "@mui/material";
import { useNotify, useRecordContext } from "react-admin";

const transform = (data: any) => {
  return {
    ...data,
    taxComissions: data.taxComissions.map((taxComission: any) => ({
      id: taxComission.id || undefined,
      name: taxComission.name,
      value: taxComission.value,
      subscriptionPlanId: taxComission.subscriptionPlanId
        ? taxComission.subscriptionPlanId
        : undefined,
    })),
    categories: data.categories.map(
      (category: any) =>
        typeof category === "object" && category.categoryId
          ? { id: category.categoryId } // Se for um objeto com categoryId
          : { id: category }, // Se for apenas um ID (string)
    ),
    images: data.images.map((image: any) => ({
      id: image.id || undefined, // Garante que IDs existentes são enviados, ou undefined para novos registros
      url: image.url,
      color: image.color
        ? {
            id: image.color.id || undefined,
            name: image.color.name,
            hex: image.color.hex,
            ncm: image.color.ncm,
            sizes: image.color.sizes.map((size: any) => ({
              id: size.id || undefined,
              name: size.name,
              sku: size.sku,
            })),
          }
        : undefined, // Ignora cores inexistentes
    })),
  };
};

const ImagesReorder: React.FC = () => {
  const record = useRecordContext<any>();
  const notify = useNotify();
  const [order, setOrder] = useState<string[]>([]);

  useEffect(() => {
    if (record?.images) {
      // Inicializa com a ordem vinda do backend
      setOrder(record.images.map((img: any) => img.id));
    }
  }, [record]);

  const move = (from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev];
      const [m] = next.splice(from, 1);
      next.splice(to, 0, m);
      return next;
    });
  };

  const saveOrder = async () => {
    try {
      const apiUrl = (import.meta as any).env.VITE_SIMPLE_REST_URL;
      const response = await fetch(`${apiUrl}/products/${record.id}/images/order`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ imageIds: order }),
      });
      if (response.ok) {
        notify("Ordem das cores atualizada", { type: "success" });
      }
      else {
        notify("Falha ao atualizar ordem das cores", { type: "warning" });
      }
    } catch (e) {
      notify("Falha ao atualizar ordem das cores", { type: "warning" });
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <h3>Ordenar Cores</h3>
        <ol>
          {order.map((id, index) => {
            const img = record?.images?.find((i: any) => i.id === id);
            return (
              <li key={id} style={{ marginBottom: 8 }}>
                <span style={{ marginRight: 12 }}>
                  {img?.color?.name ?? img?.url}
                </span>
                <Button
                  size="small"
                  disabled={index === 0}
                  onClick={() => move(index, index - 1)}
                >
                  ↑
                </Button>
                <Button
                  size="small"
                  disabled={index === order.length - 1}
                  onClick={() => move(index, index + 1)}
                >
                  ↓
                </Button>
              </li>
            );
          })}
        </ol>
        <Button variant="contained" onClick={saveOrder}>
          Salvar ordem
        </Button>
      </CardContent>
    </Card>
  );
};

const ProductEdit: React.FC = (props) => (
  <Edit {...props} transform={transform}>
    <TabbedForm>
      <FormTab label="General">
        <TextInput source="name" />
        <TextInput source="factoryName" />
        <TextInput multiline source="description" />
        <TextInput source="ncm" />
        <NumberInput source="cost" />
        <NumberInput source="price" />
        <SelectInput
          source="gender"
          choices={[
            { id: "MALE", name: "Male" },
            { id: "FEMALE", name: "Female" },
            { id: "UNISEX", name: "Unisex" },
          ]}
          validate={required()}
        />
        <BooleanInput source="active" />
        <ArrayInput source="categories">
          <SimpleFormIterator>
            <ReferenceInput source="categoryId" reference="categories">
              <SelectInput optionText="name" />
            </ReferenceInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      <FormTab label="Details">
  <ImagesReorder />
        <ArrayInput source="images">
          <SimpleFormIterator>
            <ProductImageInput source="url" label="Product Image" />
            <TextInput source="color.name" label="Color Name" />
            <TextInput source="color.hex" label="Color Hex" />
            <ArrayInput source="color.sizes">
              <SimpleFormIterator>
                <TextInput
                  source="name"
                  label="Size Name"
                  validate={required()}
                />
                <TextInput source="sku" label="SKU" validate={required()} />
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      <FormTab label="Tax">
        <ArrayInput source="taxComissions">
          <SimpleFormIterator>
            <TextInput source="name" label="Name" validate={required()} />
            <NumberInput source="value" label="Value" validate={required()} />
            <ReferenceInput
              label="Subscription Plan"
              source="subscriptionPlanId"
              reference="subscription-plan"
              format={(value) => value && value.id}
              parse={(value) => ({ subscriptionPlanId: value })}
            >
              <SelectInput optionText="name" />
            </ReferenceInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  </Edit>
);

export default ProductEdit;
