import React from 'react';
import { Edit, SimpleForm, TextInput, NumberInput, SelectInput, ReferenceArrayInput, SelectArrayInput, ArrayInput, SimpleFormIterator } from 'react-admin';

const ProductEdit: React.FC = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="factoryName" />
            <TextInput source="description" />
            <NumberInput source="salePrice" />
            <NumberInput source="suggestedDiscountPrice" />
            <NumberInput source="suggestedPrice" />
            <SelectInput source="gender" choices={[
                { id: 'MALE', name: 'Male' },
                { id: 'FEMALE', name: 'Female' },
                { id: 'UNISEX', name: 'Unisex' },
            ]} />
            <ReferenceArrayInput source="categories" reference="categories">
                <SelectArrayInput optionText="name" />
            </ReferenceArrayInput>
            <ArrayInput source="images">
                <SimpleFormIterator>
                    <TextInput source="hex" />
                    <TextInput source="url" />
                    <TextInput source="color" />
                </SimpleFormIterator>
            </ArrayInput>
            <ArrayInput source="colors">
                <SimpleFormIterator>
                    <TextInput source="name" />
                    <TextInput source="hex" />
                    <TextInput source="ncm" />
                    <ArrayInput source="sizes">
                        <SimpleFormIterator>
                            <TextInput source="name" />
                            <TextInput source="sku" />
                        </SimpleFormIterator>
                    </ArrayInput>
                </SimpleFormIterator>
            </ArrayInput>
        </SimpleForm>
    </Edit>
);

export default ProductEdit;