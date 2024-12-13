import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import damLogo from '../../../../assets/damLogo.png';
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
        height: 50,
    },
    headerInfo: {
        marginLeft: 15,
        flex: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#700F23',
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    clientInfo: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        borderLeft: 2,
        borderColor: '#700F23',
    },
    clientInfoText: {
        fontSize: 10,
        color: '#333',
        marginBottom: 3,
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
        fontWeight: 'bold',
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

const MaterialesPDF = ({ materiales, selectedQuantities, totals, formatCLP, client, job }) => {
    const currentDate = new Date().toLocaleDateString('es-CL');
    const materialesSeleccionadosBD = materiales.filter(material => material.is_selected);
    const totalesSeleccionados = materialesSeleccionadosBD.reduce((acc, material) => {
        const quantity = selectedQuantities[material.material_id] || 0;
        return {
            totalQuantity: acc.totalQuantity + quantity,
            totalAmount: acc.totalAmount + (quantity * (material.current_value || 0))
        };
    }, { totalQuantity: 0, totalAmount: 0 });

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image style={styles.logo} src={damLogo} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>Lista de Materiales</Text>
                        <Text style={styles.subtitle}>Fecha: {currentDate}</Text>
                    </View>
                </View>

                <View style={styles.clientInfo}>
                    <Text style={[styles.clientInfoText, { fontWeight: 'bold' }]}>
                        Cliente: {client?.name || 'Sin cliente'}
                    </Text>
                    <Text style={styles.clientInfoText}>
                        Proyecto: {job?.project_name || 'Sin proyecto'}
                    </Text>
                    <Text style={styles.clientInfoText}>
                        Cotización N°: {job?.quote_number || 'Sin número'}
                    </Text>
                </View>

                <View style={[styles.section, { marginTop: 20 }]}>
                    <Text style={styles.sectionTitle}>Detalle de Materiales Seleccionados</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableHeaderCell}>CATEGORÍA</Text>
                            <Text style={[styles.tableHeaderCell, { flex: 2 }]}>DESCRIPCIÓN</Text>
                            <Text style={styles.tableHeaderCell}>CANTIDAD</Text>
                            <Text style={styles.tableHeaderCell}>VALOR UNIT</Text>
                            <Text style={styles.tableHeaderCell}>TOTAL</Text>
                        </View>

                        {materialesSeleccionadosBD.map((material, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{material.category}</Text>
                                <Text style={[styles.tableCell, { flex: 2 }]}>{material.description}</Text>
                                <Text style={styles.tableCell}>
                                    {selectedQuantities[material.material_id] || 0}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {formatCLP(material.current_value)}
                                </Text>
                                <Text style={styles.tableCell}>
                                    {formatCLP(selectedQuantities[material.material_id] * material.current_value)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Cantidad Total:</Text>
                            <Text style={styles.summaryValue}>{totalesSeleccionados.totalQuantity}</Text>
                        </View>
                        <View style={[styles.summaryRow, { backgroundColor: '#700F23', padding: 8, borderRadius: 4 }]}>
                            <Text style={[styles.summaryLabel, { color: '#ffffff' }]}>TOTAL NETO:</Text>
                            <Text style={[styles.summaryValue, { color: '#ffffff' }]}>
                                {formatCLP(totalesSeleccionados.totalAmount)}
                            </Text>
                        </View>
                    </View>
                </View>

                <Text style={styles.footer}>
                    Documento generado el {currentDate} | 
                    Cliente: {client?.name || 'Sin cliente'} | 
                    Proyecto: {job?.project_name || 'Sin proyecto'} | 
                    CTZ: {job?.quote_number || 'Sin número'} |
                    Total materiales: {materialesSeleccionadosBD.length}
                </Text>
            </Page>
        </Document>
    );
};

const DescargarPDF = ({ materiales, selectedQuantities, totals, formatCLP, client, job }) => {
    const haySeleccionados = materiales.some(material => material.is_selected);

    if (!haySeleccionados) {
        return (
            <button 
                className="flex items-center space-x-1 bg-gray-400 text-white px-4 py-2 rounded cursor-not-allowed" 
                disabled
                title="No hay materiales seleccionados en la BD"
            >
                <FiDownload className="text-lg" />
                <span>Sin materiales seleccionados</span>
            </button>
        );
    }

    return (
        <PDFDownloadLink
            document={
                <MaterialesPDF
                    materiales={materiales}
                    selectedQuantities={selectedQuantities}
                    totals={totals}
                    formatCLP={formatCLP}
                    client={client}
                    job={job}
                />
            }
            fileName={`materiales_${client?.name || 'sin_cliente'}_${job?.quote_number || 'sin_numero'}_${new Date().toISOString().split('T')[0]}.pdf`}
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

export default DescargarPDF;