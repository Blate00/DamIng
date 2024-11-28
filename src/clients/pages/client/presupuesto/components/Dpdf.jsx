import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import damLogo from '../../../../../assets/damLogo.png';
import { FiDownload } from 'react-icons/fi';

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#f9f9f9',
        padding: 20,
        fontFamily: 'Helvetica',
    },
    header: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 50,
        height: 40,
    },
    headerInfo: {
        marginLeft: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#700F23',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
    },
    section: {
        margin: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#700F23',
    },
    table: {
        display: 'table',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#bfbfbf',
        minHeight: 25,
        alignItems: 'center',
    },
    tableHeader: {
        backgroundColor: '#700F23',
    },
    tableHeaderCell: {
        flex: 1,
        padding: 5,
        fontSize: 8,
        color: '#ffffff',
        textAlign: 'center',
    },
    tableCell: {
        flex: 1,
        padding: 5,
        fontSize: 8,
        textAlign: 'center',
    },
    summaryContainer: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        marginBottom: 10,
        borderRadius: 4,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 5,
        marginBottom: 5,
    },
    summaryLabel: {
        fontSize: 10,
        color: '#666',
    },
    summaryValue: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
        textAlign: 'center',
        fontSize: 8,
        color: '#666',
    },
});

const MyDocument = ({ job, client, items, formatCLP, ggPercentage, gestionPercentage }) => {
    const currentDate = new Date().toLocaleDateString('es-CL');
    const totalNeto = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const ggAmount = (totalNeto * ggPercentage) / 100;
    const gestionAmount = (totalNeto * gestionPercentage) / 100;
    const subtotal = totalNeto + ggAmount + gestionAmount;

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image style={styles.logo} src={damLogo} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>Presupuesto</Text>
                        <Text style={styles.subtitle}>
                            {job?.project_name || 'Sin proyecto'} - {client?.name || 'Sin cliente'}
                        </Text>
                        <Text style={styles.subtitle}>
                            CTZ: {job?.quote_number || 'Sin número'} | Fecha: {currentDate}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Servicios Eléctricos</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableHeaderCell}>ITEM</Text>
                            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>DESCRIPCIÓN</Text>
                            <Text style={styles.tableHeaderCell}>CANTIDAD</Text>
                            <Text style={styles.tableHeaderCell}>VALOR UNIT</Text>
                            <Text style={styles.tableHeaderCell}>TOTAL</Text>
                        </View>
                        {items.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{index + 1}</Text>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{item.description || ''}</Text>
                                <Text style={styles.tableCell}>{item.quantity || ''}</Text>
                                <Text style={styles.tableCell}>{formatCLP(item.unit_price)}</Text>
                                <Text style={styles.tableCell}>{formatCLP(item.total)}</Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Neto:</Text>
                            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>
                                {formatCLP(totalNeto)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>GG ({ggPercentage}%):</Text>
                            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>
                                {formatCLP(ggAmount)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Gestión ({gestionPercentage}%):</Text>
                            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>
                                {formatCLP(gestionAmount)}
                            </Text>
                        </View>
                        <View style={[styles.summaryRow, { backgroundColor: '#700F23', padding: 8, borderRadius: 4 }]}>
                            <Text style={[styles.summaryLabel, { color: '#ffffff' }]}>TOTAL:</Text>
                            <Text style={[styles.summaryValue, { color: '#ffffff' }]}>
                                {formatCLP(subtotal)}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Documento generado el {currentDate} | Proyecto: {job?.project_name || 'Sin proyecto'} |
                    Cliente: {client?.name || 'Sin cliente'} | CTZ: {job?.quote_number || 'Sin número'}
                </Text>
            </Page>
        </Document>
    );
};

const Dpdf = ({ job, client, items, formatCLP, ggPercentage, gestionPercentage }) => {
    return (
        <PDFDownloadLink
            document={
                <MyDocument
                    job={job}
                    client={client}
                    items={items}
                    formatCLP={formatCLP}
                    ggPercentage={ggPercentage}
                    gestionPercentage={gestionPercentage}
                />
            }
            fileName={`presupuesto_${job?.quote_number || 'sin_numero'}_${new Date().toISOString().split('T')[0]}.pdf`}
        >
            {({ loading }) => (
                loading ? (
                    <button className="flex items-center space-x-1 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" disabled>
                        <FiDownload className="text-lg animate-spin" />
                        <span>Generando PDF...</span>
                    </button>
                ) : (
                    <button className="flex items-center space-x-1 bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300">
                        <FiDownload className="text-lg" />
                    </button>
                )
            )}
        </PDFDownloadLink>
    );
};

export default Dpdf;