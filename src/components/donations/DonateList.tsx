import React from 'react';
import { List, Datagrid, TextField, NumberField, ReferenceField, DateField, Filter, ReferenceInput, SelectInput } from 'react-admin';
import { ListProps } from 'react-admin';

const DonateFilter: React.FC = (props) => (
    <Filter {...props}>
        <ReferenceInput label="Streamer" source="streamerId" reference="streamers" alwaysOn>
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

const DonateList = (props: ListProps) => {
    return (
        <List
            {...props}
            filters={<DonateFilter />}
            filterDefaultValues={{ streamerId: "" }}
        >
            <Datagrid>
                <TextField source="id" />
                <ReferenceField source="streamerId" reference="streamers">
                    <TextField source="name" />
                </ReferenceField>
                <TextField source="transactionId" />
                <NumberField source="amount" />
                <TextField source="message" />
                <TextField source="username" />
                <TextField source="paymentCode" />
                <DateField source="createdAt" />
            </Datagrid>
        </List>
    );
};

export default DonateList;