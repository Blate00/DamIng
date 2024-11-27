import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image, PDFDownloadLink } from '@react-pdf/renderer';
import damLogo from '../../../../../assets/damLogo.png'; // Asegúrate de que la ruta y la extensión sean correctas
import { FiDownload } from 'react-icons/fi'; // Importa el ícono
const MyDocument = ({ job, client, items, formatCLP, ggPercentage, gestionPercentage }) => {
  const currentDate = new Date().toLocaleDateString('es-CL');

  // Cálculos de totales
  const totalNeto = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  const ggAmount = (totalNeto * ggPercentage) / 100;
  const gestionAmount = (totalNeto * gestionPercentage) / 100;
  const subtotal = totalNeto + ggAmount + gestionAmount;
  const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#f9f9f9',
      fontFamily: 'Helvetica',
      fontSize: 10,
      padding: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    logo: {
      width: 50,
      height: 40,
      marginRight: 15,
    },
    titleSection: {
      flexDirection: 'column',
      marginLeft: 15,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#2a3f54',
    },
    subtitle: {
      fontSize: 12,
      color: '#6b6b6b',
    },
    table: {
      width: '100%',
      marginTop: 15,
      borderWidth: 1,
      borderColor: '#e0e0e0',
      borderRadius: 4,
      overflow: 'hidden',
    },
    tableHeader: {
      flexDirection: 'row',
      backgroundColor: '#700F23',
      color: '#fff',
      padding: 8,
      fontWeight: 'bold',
    },
    tableRow: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    tableRowAlt: {
      backgroundColor: '#f6f8fa',
    },
    tableCellHeader: {
      flex: 1,
      fontSize: 10,
      textAlign: 'center',
      padding: 8,
    },
    tableCell: {
      flex: 1,
      fontSize: 10,
      textAlign: 'center',
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: '#e0e0e0',
    },
    summary: {
      marginTop: 20,
      padding: 10,
      backgroundColor: '#f1f1f1',
      borderRadius: 4,
    },
    summaryItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    summaryLabel: {
      fontSize: 10,
      color: '#6b6b6b',
    },
    summaryValue: {
      fontSize: 10,
      fontWeight: 'bold',
    },
    footer: {
      marginTop: 'auto',
      textAlign: 'center',
      fontSize: 8,
      color: '#a0a0a0',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#e0e0e0',
    },  summaryHighlight: {
        backgroundColor: '#700F23',
        padding: 8,
        marginTop: 5,
        borderRadius: 4,
      },
      summaryHighlightText: {
        color: '#ffffff',
        fontWeight: 'bold',
      }
    
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Image src={damLogo} style={styles.logo} />
          <View style={styles.titleSection}>
            <Text style={styles.title}>{job?.project_name || 'Proyecto sin nombre'}</Text>
            <Text style={styles.subtitle}>
              Nº CTZ: {job?.quote_number || 'Sin número'} | {currentDate} | {client?.name || 'Cliente sin nombre'}
            </Text>
          </View>
        </View>
        <Text style={{ fontSize: 14, fontWeight: 'bold', marginBottom: 10, color: '#2a3f54' }}>Presupuesto</Text>
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.tableCellHeader}>ITEM</Text>
            <Text style={styles.tableCellHeader}>DESCRIPCIÓN</Text>
            <Text style={styles.tableCellHeader}>CANTIDAD</Text>
            <Text style={styles.tableCellHeader}>VALOR UNIT</Text>
            <Text style={styles.tableCellHeader}>TOTAL</Text>
          </View>
          {items.map((item, index) => (
            <View
              key={index}
              style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlt]}
            >
              <Text style={styles.tableCell}>{index + 1}</Text>
              <Text style={styles.tableCell}>{item.description || ''}</Text>
              <Text style={styles.tableCell}>{item.quantity || ''}</Text>
              <Text style={styles.tableCell}>{formatCLP(item.unit_price)}</Text>
              <Text style={styles.tableCell}>{formatCLP(item.total)}</Text>
            </View>
          ))}
        </View>
        <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Total Neto:</Text>
          <Text style={styles.summaryValue}>
            {formatCLP(totalNeto)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>GG ({ggPercentage}%):</Text>
          <Text style={styles.summaryValue}>
            {formatCLP(ggAmount)}
          </Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Gestión ({gestionPercentage}%):</Text>
          <Text style={styles.summaryValue}>
            {formatCLP(gestionAmount)}
          </Text>
        </View>

        {/* Subtotal destacado */}
        <View style={styles.summaryHighlight}>
          <View style={styles.summaryItem}>
            <Text style={[styles.summaryLabel, styles.summaryHighlightText]}>
              Subtotal:
            </Text>
            <Text style={[styles.summaryValue, styles.summaryHighlightText]}>
              {formatCLP(subtotal)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.footer}>
        Documento generado el {currentDate} | Proyecto: {job?.project_name} | 
        Cliente: {client?.name} | CTZ: {job?.quote_number}
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
    fileName={`presupuesto_${job?.quote_number || 'sin_numero'}.pdf`}
  >
    {({ loading }) => (
      loading ? (
        'Cargando documento...'
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