import React from 'react';  
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';  
import { FiDownload } from 'react-icons/fi';  
import damLogo from '../../assets/damLogo.png';  

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
    },  
    title: {  
        fontSize: 20,  
        fontWeight: 'bold',  
        color: '#700F23',  
    },  
    employeeInfo: {  
        margin: 10,  
        padding: 10,  
        backgroundColor: '#fff',  
        borderRadius: 5,  
    },  
    summaryGrid: {  
        flexDirection: 'row',  
        flexWrap: 'wrap',  
        marginBottom: 20,  
    },  
    summaryItem: {  
        width: '20%',  
        padding: 10,  
        backgroundColor: '#f1f1f1',  
        margin: 5,  
        borderRadius: 4,  
    },  
    table: {  
        display: 'table',  
        width: 'auto',  
        borderStyle: 'solid',  
        borderWidth: 1,  
        borderColor: '#bfbfbf',  
        marginTop: 10,  
    },  
    tableRow: {  
        flexDirection: 'row',  
        borderBottomWidth: 1,  
        borderColor: '#bfbfbf',  
    },  
    tableHeader: {  
        backgroundColor: '#700F23',  
    },  
    tableCell: {  
        flex: 1,  
        padding: 5,  
        fontSize: 8,  
        textAlign: 'center',  
    },  
    tableHeaderCell: {  
        flex: 1,  
        padding: 5,  
        fontSize: 8,  
        color: '#ffffff',  
        textAlign: 'center',  
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

const LiquidacionPDF = ({ fechaPago, pagos, empleado, totales, formatCLP }) => (  
    <Document>  
        <Page size="A4" style={styles.page}>  
            <View style={styles.header}>  
                <Image style={styles.logo} src={damLogo} />  
                <View style={styles.headerInfo}>  
                    <Text style={styles.title}>Liquidación de Pagos</Text>  
                    <Text>Fecha de Pago: {fechaPago}</Text>  
                </View>  
            </View>  

            {/* Información del empleado */}  
            <View style={styles.employeeInfo}>  
                <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10 }}>  
                    Datos del Trabajador  
                </Text>  
                <Text>Nombre: {empleado.nombre}</Text>  
                <Text>Correo: {empleado.correo}</Text>  
                <Text>Teléfono: {empleado.telefono}</Text>  
            </View>  

            {/* Resumen de totales */}  
          

            {/* Tabla de pagos */}  
            <View style={styles.table}>  
                <View style={[styles.tableRow, styles.tableHeader]}>  
                    <Text style={styles.tableHeaderCell}>Fecha</Text>  
                    <Text style={styles.tableHeaderCell}>Proyecto</Text>  
                    <Text style={styles.tableHeaderCell}>Pago Día</Text>  
                    <Text style={styles.tableHeaderCell}>Colación</Text>  
                    <Text style={styles.tableHeaderCell}>Gestión</Text>  
                    <Text style={styles.tableHeaderCell}>Extra</Text>  
                    <Text style={styles.tableHeaderCell}>Total</Text>  
                </View>  

                {pagos.map((pago, index) => (  
                    <View key={index} style={styles.tableRow}>  
                        <Text style={styles.tableCell}>  
                            {new Date(pago.trabajo_fecha).toLocaleDateString()}  
                        </Text>  
                        <Text style={styles.tableCell}>{pago.project_name}</Text>  
                        <Text style={styles.tableCell}>{formatCLP(pago.pago_dia)}</Text>  
                        <Text style={styles.tableCell}>{formatCLP(pago.colacion)}</Text>  
                        <Text style={styles.tableCell}>{formatCLP(pago.gestion)}</Text>  
                        <Text style={styles.tableCell}>{formatCLP(pago.extra)}</Text>  
                        <Text style={styles.tableCell}>{formatCLP(pago.total_payment)}</Text>  
                    </View>  
                ))}  

                {/* Fila de totales */}  
                <View style={[styles.tableRow, { backgroundColor: '#f1f1f1' }]}>  
                    <Text style={[styles.tableCell, { flex: 2 }]}>Totales:</Text>  
                    <Text style={styles.tableCell}>{formatCLP(totales.pagoDia)}</Text>  
                    <Text style={styles.tableCell}>{formatCLP(totales.colacion)}</Text>  
                    <Text style={styles.tableCell}>{formatCLP(totales.gestion)}</Text>  
                    <Text style={styles.tableCell}>{formatCLP(totales.extra)}</Text>  
                    <Text style={styles.tableCell}>{formatCLP(totales.total)}</Text>  
                </View>  
            </View>  

            <Text style={styles.footer}>  
                Liquidación generada el {new Date().toLocaleDateString()} |   
                Empleado: {empleado.nombre} | Fecha de pago: {fechaPago}  
            </Text>  
        </Page>  
    </Document>  
);  

const DescargarLiquidacionPDF = ({ fechaPago, pagos, empleado, totales, formatCLP }) => {  
    return (  
        <PDFDownloadLink  
            document={  
                <LiquidacionPDF  
                    fechaPago={fechaPago}  
                    pagos={pagos}  
                    empleado={empleado}  
                    totales={totales}  
                    formatCLP={formatCLP}  
                />  
            }  
            fileName={`liquidacion_${empleado.nombre}_${fechaPago}.pdf`}  
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

export default DescargarLiquidacionPDF;  