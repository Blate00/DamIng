import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import { FiDownload } from 'react-icons/fi';
import damLogo from '../../../../assets/damLogo.png';

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

const MyDocument = ({ job, client, items = [], asignacionesData = [], manoObraData = {}, proveedores = [], formatCLP }) => {
    const currentDate = new Date().toLocaleDateString('es-CL');

    // Cálculos con validación
    const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
    const asignaciones = Array.isArray(asignacionesData) ? asignacionesData : [];
    const abonosManoObra = Array.isArray(manoObraData.abonos) ? manoObraData.abonos : [];

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('es-CL');
        } catch (error) {
            return 'Fecha inválida';
        }
    };

    const getProveedorNombre = (item) => {
        return item.proveedor_nombre || 'N/A';
    };

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Image style={styles.logo} src={damLogo} />
                    <View style={styles.headerInfo}>
                        <Text style={styles.title}>Rendición de Gastos</Text>
                        <Text style={styles.subtitle}>
                            {job?.project_name || 'Sin proyecto'} - {client?.name || 'Sin cliente'}
                        </Text>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Detalle de Rendiciones</Text>
                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableHeaderCell}>Fecha</Text>
                            <Text style={styles.tableHeaderCell}>Detalle</Text>
                            <Text style={styles.tableHeaderCell}>Folio</Text>
                            <Text style={styles.tableHeaderCell}>Proveedor</Text>
                            <Text style={styles.tableHeaderCell}>Total</Text>
                        </View>
                        {items.map((item, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{formatDate(item.fecha)}</Text>
                                <Text style={styles.tableCell}>{item.detalle || '-'}</Text>
                                <Text style={styles.tableCell}>{item.folio || '-'}</Text>
                                <Text style={styles.tableCell}>{getProveedorNombre(item)}</Text>
                                <Text style={styles.tableCell}>{formatCLP(item.total)}</Text>
                            </View>
                            
                        ))}
                    </View> <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Rendición:</Text>
                            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>
                                {formatCLP(totalRendicion)}
                            </Text>
                        </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Asignación</Text>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Rendición:</Text>
                            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>
                                {formatCLP(totalRendicion)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Saldo Abonado:</Text>
                            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>
                                {formatCLP(asignacionesData[0]?.saldo_recibido || 0)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Saldo Despues de Rendición:</Text>
                            <Text style={[styles.summaryValue, { color: '#B91C1C' }]}>
                                {formatCLP((asignacionesData[0]?.saldo_recibido || 0) - totalRendicion)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableHeaderCell}>Monto Recibido</Text>
                            <Text style={styles.tableHeaderCell}>Medio</Text>
                            <Text style={styles.tableHeaderCell}>Fecha</Text>
                        </View>
                        {asignaciones.map((asignacion, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{formatCLP(asignacion.saldo_recibido)}</Text>
                                <Text style={styles.tableCell}>{asignacion.medio_pago || 'No especificado'}</Text>
                                <Text style={styles.tableCell}>
                                    {formatDate(asignacion.fecha_actualizacion)}
                                </Text>
                            </View>
                        ))}
                        {asignaciones.length === 0 && (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { textAlign: 'center', flex: 3 }]}>
                                    No hay asignaciones disponibles
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mano de Obra</Text>
                    <View style={styles.summaryContainer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Mano de Obra:</Text>
                            <Text style={styles.summaryValue}>
                                {formatCLP(manoObraData?.total_mano_obra || 0)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Recibido:</Text>
                            <Text style={styles.summaryValue}>
                                {formatCLP(manoObraData?.total_recibido || 0)}
                            </Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Saldo Actual:</Text>
                            <Text style={styles.summaryValue}>
                                {formatCLP(manoObraData?.saldo_actual || 0)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.table}>
                        <View style={[styles.tableRow, styles.tableHeader]}>
                            <Text style={styles.tableHeaderCell}>Monto Recibido</Text>
                            <Text style={styles.tableHeaderCell}>Medio</Text>
                            <Text style={styles.tableHeaderCell}>Fecha</Text>
                        </View>
                        {abonosManoObra.map((abono, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{formatCLP(abono.saldo_recibido)}</Text>
                                <Text style={styles.tableCell}>{abono.medio_pago}</Text>
                                <Text style={styles.tableCell}>{formatDate(abono.fecha_actualizacion)}</Text>
                            </View>
                        ))}
                        {abonosManoObra.length === 0 && (
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, { textAlign: 'center', flex: 3 }]}>
                                    No hay abonos disponibles
                                </Text>
                            </View>
                        )}
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

const Dpdf = ({ job, client, items, asignacionesData, manoObraData, proveedores, formatCLP }) => {
    return (
        <PDFDownloadLink
            document={
                <MyDocument
                    job={job}
                    client={client}
                    items={items}
                    asignacionesData={asignacionesData}
                    manoObraData={manoObraData}
                    proveedores={proveedores}
                    formatCLP={formatCLP}
                />
            }
            fileName={`rendicion_${job?.quote_number || 'sin_numero'}_${new Date().toISOString().split('T')[0]}.pdf`}
        >
            {({ loading, error }) => (
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