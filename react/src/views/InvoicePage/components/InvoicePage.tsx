import React, { FC, useState, useEffect } from 'react';
import { Invoice, Order, Product } from '../data/types';
import { initialInvoice, initialOrder, initialProduct } from '../data/initialData';
import EditableInput from './EditableInput';
import EditableSelect from './EditableSelect';
import EditableTextarea from './EditableTextarea';
import EditableCalendarInput from './EditableCalendarInput';
import EditableFileImage from './EditableFileImage';
import countryList from '../data/countryList';
import Document from './Document';
import Page from './Page';
import View from './View';
import Text from './Text';
import { Font } from '@react-pdf/renderer';
import Download from './DownloadPDF';
import format from 'date-fns/format';

Font.register({
    family: 'Nunito',
    fonts: [
        { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXV3I6Li01BKofINeaE.ttf' },
        { src: 'https://fonts.gstatic.com/s/nunito/v12/XRXW3I6Li01BKofA6sKUYevN.ttf', fontWeight: 600 },
    ],
});

interface Props {
    data?: Invoice;
    pdfMode?: boolean;
    onChange?: (invoice: Invoice) => void;
}

const InvoicePage: FC<Props> = ({ data, pdfMode, onChange }) => {
    const [invoice, setInvoice] = useState<Invoice>(data ? { ...data, orders: data.orders || [] } : { ...initialInvoice });
    const [subTotal, setSubTotal] = useState<number>();

    const dateFormat = 'MMM dd, yyyy';
    const invoiceDate = invoice.invoiceDate !== '' ? new Date(invoice.invoiceDate) : new Date();
    const invoiceDueDate =
        invoice.invoiceDueDate !== ''
            ? new Date(invoice.invoiceDueDate)
            : new Date(invoiceDate.valueOf());

    if (invoice.invoiceDueDate === '') {
        invoiceDueDate.setDate(invoiceDueDate.getDate() + 30);
    }

    const handleChange = (name: keyof Invoice, value: string | number) => {
        if (name !== 'orders') {
            const newInvoice = { ...invoice };

            if (name === 'logoWidth' && typeof value === 'number') {
                newInvoice[name] = value;
            } else if (name !== 'logoWidth' && typeof value === 'string') {
                newInvoice[name] = value;
            }

            setInvoice(newInvoice);
        }
    };

    const handleOrderChange = (index: number, name: keyof Order, value: string) => {
        const orders = invoice.orders.map((order, i) => {
            if (i === index) {
                const newOrder = { ...order, [name]: value };
                return newOrder;
            }
            return order;
        });
        setInvoice({ ...invoice, orders });
    };

    const handleProductChange = (orderIndex: number, productIndex: number, name: keyof Product, value: string | number) => {
        const orders = invoice.orders.map((order, i) => {
            if (i === orderIndex) {
                const products = order.products.map((product, j) => {
                    if (j === productIndex) {
                        return { ...product, [name]: value };
                    }
                    return product;
                });
                return { ...order, products };
            }
            return order;
        });
        setInvoice({ ...invoice, orders });
    };

    const handleAddOrder = () => {
        const orders = [...invoice.orders, { ...initialOrder, products: [{ ...initialProduct }] }];
        setInvoice({ ...invoice, orders });
    };

    const handleRemoveOrder = (index: number) => {
        const orders = invoice.orders.filter((_, i) => i !== index);
        setInvoice({ ...invoice, orders });
    };

    const handleAddProduct = (orderIndex: number) => {
        const orders = invoice.orders.map((order, i) => {
            if (i === orderIndex) {
                return { ...order, products: [...order.products, { ...initialProduct }] };
            }
            return order;
        });
        setInvoice({ ...invoice, orders });
    };

    const handleRemoveProduct = (orderIndex: number, productIndex: number) => {
        const orders = invoice.orders.map((order, i) => {
            if (i === orderIndex) {
                const products = order.products.filter((_, j) => j !== productIndex);
                return { ...order, products };
            }
            return order;
        });
        setInvoice({ ...invoice, orders });
    };

    useEffect(() => {
        let subTotal = 0;
        (invoice.orders || []).forEach((order) => {
            (order.products || []).forEach((product) => {
                const amount = (product.price || 0) - (product.discount || 0);
                subTotal += amount;
            });
        });
        setSubTotal(subTotal);
    }, [invoice.orders]);

    useEffect(() => {
        if (onChange) {
            onChange(invoice);
        }
    }, [onChange, invoice]);

    return (
        <Document pdfMode={pdfMode}>
            <Page className="invoice-wrapper" pdfMode={pdfMode}>
                {!pdfMode && <Download data={invoice} />}

                <View className="flex" pdfMode={pdfMode}>
                    <View className="w-50" pdfMode={pdfMode}>
                        <EditableFileImage
                            className="logo"
                            placeholder="Your Logo"
                            value={invoice.logo}
                            width={invoice.logoWidth}
                            pdfMode={pdfMode}
                            onChangeImage={(value) => handleChange('logo', value)}
                            onChangeWidth={(value) => handleChange('logoWidth', value)}
                        />
                        <EditableInput
                            className="fs-20 bold"
                            placeholder="Your Company"
                            value={invoice.companyName}
                            onChange={(value) => handleChange('companyName', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableInput
                            placeholder="Your Name"
                            value={invoice.name}
                            onChange={(value) => handleChange('name', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableInput
                            placeholder="Company's Address"
                            value={invoice.companyAddress}
                            onChange={(value) => handleChange('companyAddress', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableInput
                            placeholder="City, State Zip"
                            value={invoice.companyAddress2}
                            onChange={(value) => handleChange('companyAddress2', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableSelect
                            options={countryList}
                            value={invoice.companyCountry}
                            onChange={(value) => handleChange('companyCountry', value)}
                            pdfMode={pdfMode}
                        />
                    </View>
                    <View className="w-50" pdfMode={pdfMode}>
                        <EditableInput
                            className="fs-45 right bold"
                            placeholder="Invoice"
                            value={invoice.title}
                            onChange={(value) => handleChange('title', value)}
                            pdfMode={pdfMode}
                        />
                    </View>
                </View>

                <View className="flex mt-40-c" pdfMode={pdfMode}>
                    <View className="w-55" pdfMode={pdfMode}>
                        <EditableInput
                            className="bold dark mb-5-c"
                            value={invoice.billTo}
                            onChange={(value) => handleChange('billTo', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableInput
                            placeholder="Your Client's Name"
                            value={invoice.clientName}
                            onChange={(value) => handleChange('clientName', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableInput
                            placeholder="Client's Address"
                            value={invoice.clientAddress}
                            onChange={(value) => handleChange('clientAddress', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableInput
                            placeholder="City, State Zip"
                            value={invoice.clientAddress2}
                            onChange={(value) => handleChange('clientAddress2', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableSelect
                            options={countryList}
                            value={invoice.clientCountry}
                            onChange={(value) => handleChange('clientCountry', value)}
                            pdfMode={pdfMode}
                        />
                    </View>
                    <View className="w-45" pdfMode={pdfMode}>
                        <View className="flex mb-5-c" pdfMode={pdfMode}>
                            <View className="w-40" pdfMode={pdfMode}>
                                <EditableInput
                                    className="bold"
                                    value={invoice.invoiceTitleLabel}
                                    onChange={(value) => handleChange('invoiceTitleLabel', value)}
                                    pdfMode={pdfMode}
                                />
                            </View>
                            <View className="w-60" pdfMode={pdfMode}>
                                <EditableInput
                                    placeholder="INV-12"
                                    value={invoice.invoiceTitle}
                                    onChange={(value) => handleChange('invoiceTitle', value)}
                                    pdfMode={pdfMode}
                                />
                            </View>
                        </View>
                        <View className="flex mb-5-c" pdfMode={pdfMode}>
                            <View className="w-40" pdfMode={pdfMode}>
                                <EditableInput
                                    className="bold"
                                    value={invoice.invoiceDateLabel}
                                    onChange={(value) => handleChange('invoiceDateLabel', value)}
                                    pdfMode={pdfMode}
                                />
                            </View>
                            <View className="w-60" pdfMode={pdfMode}>
                                <EditableCalendarInput
                                    value={format(invoiceDate, dateFormat)}
                                    selected={invoiceDate}
                                    onChange={(date) =>
                                        handleChange(
                                            'invoiceDate',
                                            date && !Array.isArray(date) ? format(date, dateFormat) : ''
                                        )
                                    }
                                    pdfMode={pdfMode}
                                />
                            </View>
                        </View>
                        <View className="flex mb-5-c" pdfMode={pdfMode}>
                            <View className="w-40" pdfMode={pdfMode}>
                                <EditableInput
                                    className="bold"
                                    value={invoice.invoiceDueDateLabel}
                                    onChange={(value) => handleChange('invoiceDueDateLabel', value)}
                                    pdfMode={pdfMode}
                                />
                            </View>
                            <View className="w-60" pdfMode={pdfMode}>
                                <EditableCalendarInput
                                    value={format(invoiceDueDate, dateFormat)}
                                    selected={invoiceDueDate}
                                    onChange={(date) =>
                                        handleChange(
                                            'invoiceDueDate',
                                            date && !Array.isArray(date) ? format(date, dateFormat) : ''
                                        )
                                    }
                                    pdfMode={pdfMode}
                                />
                            </View>
                        </View>
                    </View>
                </View>

                {(invoice.orders || []).map((order, orderIndex) => (
                    <View key={orderIndex} className="order-section">
                        <EditableInput
                            placeholder="Event Date"
                            value={order.event_date}
                            onChange={(value) => handleOrderChange(orderIndex, 'event_date', value)}
                            pdfMode={pdfMode}
                        />
                        <EditableInput
                            placeholder="Event Type"
                            value={order.event_type}
                            onChange={(value) => handleOrderChange(orderIndex, 'event_type', value)}
                            pdfMode={pdfMode}
                        />
                        <View className="flex mt-20-c bg-dark p-4-8-c" pdfMode={pdfMode}>
                            <View className="w-48 p-4-8-c" pdfMode={pdfMode}>
                                <Text className="white bold">Product ID</Text>
                            </View>
                            <View className="w-17 p-4-8-c" pdfMode={pdfMode}>
                                <Text className="white bold right">Price</Text>
                            </View>
                            <View className="w-17 p-4-8-c" pdfMode={pdfMode}>
                                <Text className="white bold right">Discount</Text>
                            </View>
                            <View className="w-18 p-4-8-c" pdfMode={pdfMode}>
                                <Text className="white bold right">Action</Text>
                            </View>
                        </View>
                        {(order.products || []).map((product, productIndex) => (
                            <View key={productIndex} className="row flex" pdfMode={pdfMode}>
                                <View className="w-48 p-4-8-c pb-10-c" pdfMode={pdfMode}>
                                    <EditableInput
                                        placeholder="Product ID"
                                        value={product.product_id || ''}
                                        onChange={(value) => handleProductChange(orderIndex, productIndex, 'product_id', value)}
                                        pdfMode={pdfMode}
                                    />
                                </View>
                                <View className="w-17 p-4-8-c pb-10-c" pdfMode={pdfMode}>
                                    <EditableInput
                                        className="dark right"
                                        placeholder="Price"
                                        value={(product.price || 0).toString()}
                                        onChange={(value) => handleProductChange(orderIndex, productIndex, 'price', parseFloat(value))}
                                        pdfMode={pdfMode}
                                    />
                                </View>
                                <View className="w-17 p-4-8-c pb-10-c" pdfMode={pdfMode}>
                                    <EditableInput
                                        className="dark right"
                                        placeholder="Discount"
                                        value={(product.discount || 0).toString()}
                                        onChange={(value) => handleProductChange(orderIndex, productIndex, 'discount', parseFloat(value))}
                                        pdfMode={pdfMode}
                                    />
                                </View>
                                <View className="w-18 p-4-8-c pb-10-c" pdfMode={pdfMode}>
                                    {!pdfMode && (
                                        <button
                                            className="link row__remove"
                                            aria-label="Remove Row"
                                            title="Remove Row"
                                            onClick={() => handleRemoveProduct(orderIndex, productIndex)}
                                        >
                                            <span className="icon icon-remove bg-red"></span>
                                        </button>
                                    )}
                                </View>
                            </View>
                        ))}
                        {!pdfMode && (
                            <button className="link" onClick={() => handleAddProduct(orderIndex)}>
                                <span className="icon icon-add bg-green mr-10-c"></span>
                                Add Product
                            </button>
                        )}
                        {!pdfMode && (
                            <button className="link" onClick={() => handleRemoveOrder(orderIndex)}>
                                <span className="icon icon-remove bg-red"></span>
                                Remove Order
                            </button>
                        )}
                    </View>
                ))}
                {!pdfMode && (
                    <button className="link" onClick={handleAddOrder}>
                        <span className="icon icon-add bg-green mr-10-c"></span>
                        Add Order
                    </button>
                )}

                <View className="flex" pdfMode={pdfMode}>
                    <View className="w-50 mt-10-c" pdfMode={pdfMode}></View>
                    <View className="w-50 mt-20-c" pdfMode={pdfMode}>
                        <View className="flex bg-gray p-5-c" pdfMode={pdfMode}>
                            <View className="w-50 p-5-c" pdfMode={pdfMode}>
                                <EditableInput
                                    className="bold"
                                    value={invoice.totalLabel}
                                    onChange={(value) => handleChange('totalLabel', value)}
                                    pdfMode={pdfMode}
                                />
                            </View>
                            <View className="w-50 p-5-c flex" pdfMode={pdfMode}>
                                <EditableInput
                                    className="dark bold right ml-30-c"
                                    value={invoice.currency}
                                    onChange={(value) => handleChange('currency', value)}
                                    pdfMode={pdfMode}
                                />
                                <Text className="right bold dark w-auto" pdfMode={pdfMode}>
                                    {subTotal?.toFixed(2)}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View className="mt-20-c" pdfMode={pdfMode}>
                    <EditableInput
                        className="bold w-100"
                        value={invoice.notesLabel}
                        onChange={(value) => handleChange('notesLabel', value)}
                        pdfMode={pdfMode}
                    />
                    <EditableTextarea
                        className="w-100"
                        rows={2}
                        value={invoice.notes}
                        onChange={(value) => handleChange('notes', value)}
                        pdfMode={pdfMode}
                    />
                </View>
                <View className="mt-20-c" pdfMode={pdfMode}>
                    <EditableInput
                        className="bold w-100"
                        value={invoice.termLabel}
                        onChange={(value) => handleChange('termLabel', value)}
                        pdfMode={pdfMode}
                    />
                    <EditableTextarea
                        className="w-100"
                        rows={2}
                        value={invoice.term}
                        onChange={(value) => handleChange('term', value)}
                        pdfMode={pdfMode}
                    />
                </View>
            </Page>
        </Document>
    );
};

export default InvoicePage;
