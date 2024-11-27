// src/utils/PDFGenerator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class PDFGenerator {
constructor(job, items, proveedores, asignacionesData, manoObraData, formatCLP, logo,) {
  this.pdf = new jsPDF('p', 'mm', 'a4');
  this.currentY = 10;
  this.job = job;
  this.items = items;
  this.proveedores = proveedores;
  this.asignacionesData = asignacionesData;
  this.manoObraData = manoObraData;
  this.formatCLP = formatCLP;
  this.logo = logo;
}

async loadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}

addNewPage() {
  this.pdf.addPage();
  this.currentY = 10;
}

checkSpace(neededSpace) {
  const pageHeight = this.pdf.internal.pageSize.height;
  if (this.currentY + neededSpace > pageHeight - 20) {
    this.addNewPage();
    return true;
  }
  return false;
}

async addHeader() {
  try {
    const logoDataUrl = await this.loadImage(this.logo);
    this.pdf.addImage(logoDataUrl, 'PNG', 10, this.currentY, 40, 30);

    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`Informe Completo - ${this.job?.project_name || 'Sin nombre'}`, 55, this.currentY + 15);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`CTZ: ${this.job?.quote_number || 'Sin número'}`, 55, this.currentY + 25);
    this.pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, 150, this.currentY + 25);

    this.currentY += 45;
  } catch (error) {
    console.error('Error al cargar el logo:', error);
    this.currentY += 10;
  }
}

addRendicionesSection() {
  this.checkSpace(60);

  this.pdf.setFontSize(16);
  this.pdf.setTextColor(139, 0, 0);
  this.pdf.setFont('helvetica', 'bold');
  this.pdf.text('RENDICIONES', 10, this.currentY);
  this.currentY += 10;

  if (!this.items || this.items.length === 0) {
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('No hay rendiciones disponibles', 14, this.currentY);
    this.currentY += 20;
    return;
  }

  const rendicionesData = this.items.map(item => [
    item.fecha,
    item.detalle,
    item.folio,
    this.proveedores.find(p => p.id === item.proveedor_id)?.nombre || '',
    item.documento,
    this.formatCLP(item.total)
  ]);

  this.pdf.autoTable({
    startY: this.currentY,
    head: [['Fecha', 'Detalle', 'Folio', 'Proveedor', 'Documento', 'Total']],
    body: rendicionesData,
    theme: 'grid',
    headStyles: { fillColor: [139, 0, 0], textColor: [255, 255, 255], fontSize: 12, font: 'helvetica', fontStyle: 'bold' },
    styles: { fontSize: 10, font: 'helvetica', cellPadding: 3, overflow: 'linebreak' },
    margin: { left: 10, right: 10 }
  });

  this.currentY = this.pdf.lastAutoTable.finalY + 10;

  const totalRendicion = this.items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
  this.pdf.setFontSize(12);
  this.pdf.setFont('helvetica', 'bold');
  this.pdf.text(`Total Rendición: ${this.formatCLP(totalRendicion)}`, 130, this.currentY);
  this.currentY += 20;
}

addAsignacionesSection() {
  this.checkSpace(60);

  this.pdf.setFontSize(16);
  this.pdf.setTextColor(139, 0, 0);
  this.pdf.setFont('helvetica', 'bold');
  this.pdf.text('ASIGNACIONES', 10, this.currentY);
  this.currentY += 10;

  if (!this.asignacionesData || this.asignacionesData.length === 0) {
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text('No hay asignaciones disponibles', 14, this.currentY);
    this.currentY += 20;
    return;
  }

  const totalAsignaciones = this.asignacionesData[0].total_asignaciones || 0;
  const totalRendiciones = this.asignacionesData[0].total_rendiciones || 0;
  const saldoFinal = totalAsignaciones - totalRendiciones;

  this.pdf.setFontSize(12);
  this.pdf.setTextColor(0, 0, 0);
  this.pdf.text(`Total Asignaciones: ${this.formatCLP(totalAsignaciones)}`, 14, this.currentY);
  this.pdf.text(`Total Rendiciones: ${this.formatCLP(totalRendiciones)}`, 14, this.currentY + 7);
  this.pdf.text(`Saldo Final: ${this.formatCLP(saldoFinal)}`, 14, this.currentY + 14);
  this.currentY += 25;

  const abonosData = this.asignacionesData.map(item => [
    new Date(item.fecha_actualizacion).toLocaleDateString(),
    this.formatCLP(item.saldo_recibido),
    item.medio_pago || 'No especificado'
  ]);

  this.pdf.autoTable({
    startY: this.currentY,
    head: [['Fecha', 'Monto Recibido', 'Medio de Pago']],
    body: abonosData,
    theme: 'grid',
    headStyles: { fillColor: [139, 0, 0], textColor: [255, 255, 255], fontSize: 12, font: 'helvetica', fontStyle: 'bold' },
    styles: { fontSize: 10, font: 'helvetica', cellPadding: 3, overflow: 'linebreak' },
    margin: { left: 10, right: 10 }
  });

  this.currentY = this.pdf.lastAutoTable.finalY + 15;
}
addManoObraSection() {
    this.checkSpace(60);
  
    this.pdf.setFontSize(16);
    this.pdf.setTextColor(139, 0, 0);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('MANO DE OBRA', 10, this.currentY);
    this.currentY += 10;
  
    this.pdf.setFontSize(12);
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`Total Mano de Obra: ${this.formatCLP(this.manoObraData?.total_mano_obra || 0)}`, 14, this.currentY);
    this.pdf.text(`Total Recibido: ${this.formatCLP(this.manoObraData?.total_recibido || 0)}`, 14, this.currentY + 7);
  
    const saldoRestante = (this.manoObraData?.total_mano_obra || 0) - (this.manoObraData?.total_recibido || 0);
    this.pdf.text(`Saldo Restante: ${this.formatCLP(Math.abs(saldoRestante))}`, 14, this.currentY + 14);
    this.currentY += 25;
  
    if (Array.isArray(this.manoObraData?.abonos) && this.manoObraData.abonos.length > 0) {
      const manoObraData = this.manoObraData.abonos.map(item => [
        new Date(item.fecha_actualizacion).toLocaleDateString(),
        this.formatCLP(item.saldo_recibido),
        item.medio_pago || 'No especificado'
      ]);
  
      this.pdf.autoTable({
        startY: this.currentY,
        head: [['Fecha', 'Monto Recibido', 'Medio de Pago']],
        body: manoObraData,
        theme: 'grid',
        headStyles: { fillColor: [139, 0, 0], textColor: [255, 255, 255], fontSize: 12, font: 'helvetica', fontStyle: 'bold' },
        styles: { fontSize: 10, font: 'helvetica', cellPadding: 3, overflow: 'linebreak' },
        margin: { left: 10, right: 10 }
      });
  
      this.currentY = this.pdf.lastAutoTable.finalY + 15;
    } else {
      this.pdf.setFontSize(12);
      this.pdf.text('No hay abonos disponibles para Mano de Obra', 14, this.currentY);
      this.currentY += 20;
    }
  }
  
addFooter() {
  const pageCount = this.pdf.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    this.pdf.setPage(i);
    this.pdf.setFontSize(8);
    this.pdf.setTextColor(128, 128, 128);
    this.pdf.text(
      `Página ${i} de ${pageCount} | Proyecto: ${this.job?.project_name} | CTZ: ${this.job?.quote_number}`,
      this.pdf.internal.pageSize.width / 2,
      this.pdf.internal.pageSize.height - 10,
      { align: 'center' }
    );
  }
}

async generatePDF() {
  try {
    await this.addHeader();
    this.addRendicionesSection();
    this.addAsignacionesSection();
    this.addManoObraSection();
    this.addFooter();

    this.pdf.save(`informe_completo_${this.job?.quote_number || 'sin_numero'}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Error al generar el PDF');
  }
}
}