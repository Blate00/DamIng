import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import damLogo from '../../../assets/dam.png';
import ClientInfo from './components/ClientInfo';
import ItemsTable from './components/ItemsTable';
import Summary from './components/Summary';
import TablaRendicion from './components/TablaRendicion';
import ExportButtons from './components/ExportButtons';
import Asignacion from './components/Asignacion'; // Importar Asignacion
import ManoObra from './components/ManoObra'; // Importar ManoObra
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/outline';

const Presupuesto = () => {
  const { id, jobId } = useParams();
  const clients = JSON.parse(localStorage.getItem('clients')) || [];
  const client = clients[id];

  const [items, setItems] = useState([{ description: '', quantity: '', unitValue: '', total: '' }]);
  const [ggPercentage, setGgPercentage] = useState(20);
  const [gestionPercentage, setGestionPercentage] = useState(8);
  const [asignacion, setAsignacion] = useState(0); // Nuevo estado para Asignación
  const [abonosAsignacion, setAbonosAsignacion] = useState([]);
  const [nuevoAbonoAsignacion, setNuevoAbonoAsignacion] = useState(0);
  const [manoObra, setManoObra] = useState(0);
  const [isSectionVisible, setIsSectionVisible] = useState(true);
  const [desplegado, setDesplegado] = useState(false);
  const [desplegado1, setDesplegado1] = useState(false);



  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem('items'));
    const savedGgPercentage = localStorage.getItem('ggPercentage');
    const savedGestionPercentage = localStorage.getItem('gestionPercentage');
    const storedAsignacion = localStorage.getItem('asignacion');
    const storedManoObra = localStorage.getItem('manoObra');

    if (savedItems) setItems(savedItems);
    if (savedGgPercentage) setGgPercentage(parseFloat(savedGgPercentage));
    if (savedGestionPercentage) setGestionPercentage(parseFloat(savedGestionPercentage));
    if (storedAsignacion) setAsignacion(parseFloat(storedAsignacion) || 0);
    if (storedManoObra) setManoObra(parseFloat(storedManoObra) || 0);
  }, []);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === 'quantity' || field === 'unitValue') {
      updatedItems[index].total = (updatedItems[index].quantity * updatedItems[index].unitValue).toFixed(2);
    }
    setItems(updatedItems);

    if (
      updatedItems[index].description &&
      updatedItems[index].quantity &&
      updatedItems[index].unitValue &&
      index === updatedItems.length - 1
    ) {
      setItems([...updatedItems, { description: '', quantity: '', unitValue: '', total: '' }]);
    }
  };  const totalRecibidoAsignacion = abonosAsignacion.reduce((total, abono) => total + abono.monto, 0);
  const totalRendicion = items.reduce((total, item) => total + (parseFloat(item.total) || 0), 0);
  const saldoActualAsignacion = totalRecibidoAsignacion;
  const saldoFinalAsignacion = totalRecibidoAsignacion - totalRendicion;


  const handleGuardarAsignacion = () => {
    localStorage.setItem('asignacion', asignacion);
  };

  const handleGuardarAbonoAsignacion = (fecha, tipoTransaccion, monto) => {
    const nuevoAbono = {
      fecha,
      tipoTransaccion,
      monto
    };
    setAbonosAsignacion([...abonosAsignacion, nuevoAbono]);
  };

  const handleGuardarManoObra = () => {
    localStorage.setItem('manoObra', manoObra);
  };

  const formatCLP = (value) => parseFloat(value).toLocaleString('es-CL', { style: 'currency', currency: 'CLP' });

  const calculateNetTotal = () => items.reduce((acc, item) => acc + parseFloat(item.total || 0), 0);

  const netTotal = calculateNetTotal();
  const gg = ((netTotal * ggPercentage) / 100).toFixed(2);
  const gestion = ((netTotal * gestionPercentage) / 100).toFixed(2);
  const totalGgGestion = (parseFloat(gg) + parseFloat(gestion)).toFixed(2);
  const totalNet = (parseFloat(netTotal) + parseFloat(totalGgGestion)).toFixed(2);

  useEffect(() => {
    localStorage.setItem('netTotal', netTotal);
    setManoObra(netTotal); // Actualizar manoObra con netTotal
  }, [netTotal]);

  const handleGuardarDatos = () => {
    localStorage.setItem('items', JSON.stringify(items));
    localStorage.setItem('ggPercentage', ggPercentage);
    localStorage.setItem('gestionPercentage', gestionPercentage);
    localStorage.setItem('netTotal', netTotal);
    alert('Datos guardados con éxito');
  };

  const exportToPDF = () => {
    const input = document.getElementById('presupuesto-content');
    html2canvas(input)
      .then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(damLogo, 'JPEG', 20, 20, 20, 20);
        pdf.addImage(imgData, 'PNG', 0, 40, pdfWidth, pdfHeight);
        pdf.save('presupuesto.pdf');
      })
      .catch(err => console.error(err));
  };

  const exportToExcel = () => {
    const filteredItems = items.filter(item => item.description || item.quantity || item.unitValue);

    const data = [
      ["", "", "", "", "", ""],
      ["", "DAM INGENIERIA", "", job.name, "Nº CTZ:", "249"],
      ["", "", "", "", ""],
      ["", "", client.name, "", job.date],
      ["", "", , "",],
      ["ITEM", "DESCRIPCIÓN", "CANTIDAD", "VALOR UNIT", "TOTAL"],
      ...filteredItems.map((item, index) => [
        index + 1,
        item.description,
        item.quantity,
        item.unitValue,
        item.total
      ]),
      ["OBS:", "Documento: Boleta Honorario (+ Impto)"],
      ["", "Condición de pago por estado de avance"],
      ["", `Inversión $ ${formatCLP(netTotal)}`],
      ["", "COTIZACIÓN VALIDA POR 20 DÍAS"],
      ["", "", "", "NETO", formatCLP(netTotal)],
      ["", "", "", "GG", formatCLP(gg)],
      ["", "", "", "Gestión", formatCLP(gestion)],
      ["", "", "", "TOTAL NETO", formatCLP(totalNet)]
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    XLSX.utils.book_append_sheet(wb, ws, 'Presupuesto');
    XLSX.writeFile(wb, 'presupuesto.xlsx');
  };

  if (!client) return <div>Cliente no encontrado</div>;

  const job = client.jobs.find(job => job.id === jobId);
  if (!job) return <div>Trabajo no encontrado</div>;

  return (
    <div className="flex flex-col min-h-screen ">
      <div className="p-3 flex-grow">
        <div id="presupuesto-content" className="bg-white p-6 md:p-8 rounded-md shadow-md">
          <ClientInfo client={client} job={job} />
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado(!desplegado)}>
            <h4 className="text-center text-xl font-bold mb-4">Presupuesto</h4>
            {desplegado ? (
              <ChevronUpIcon className="w-6 h-6 text-gray-700" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-gray-700" />
            )}
          </div>

          {desplegado && (
            <div className="mt">
              <ItemsTable items={items} handleChange={handleChange} formatCLP={formatCLP} />
              <Summary 
                netTotal={netTotal} 
                ggPercentage={ggPercentage} 
                gestionPercentage={gestionPercentage}
                gg={gg}
                gestion={gestion}
                totalGgGestion={totalGgGestion}
                totalNet={totalNet}
                setGgPercentage={setGgPercentage}
                setGestionPercentage={setGestionPercentage}
                formatCLP={formatCLP}
              />
              <button
                onClick={handleGuardarDatos}
                className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Guardar datos
              </button>
            </div>
          )}
 <div className="flex items-center justify-between cursor-pointer" onClick={() => setDesplegado1(!desplegado1)}>
            <h4 className="text-center text-xl font-bold mt-10">Rendición</h4>
            {desplegado1 ? (
              <ChevronUpIcon className="w-6 h-6 text-gray-700 mt-10" />
            ) : (
              <ChevronDownIcon className="w-6 h-6 text-gray-700 mt-10" />
            )}
          </div>

          {desplegado1 && (
            <div className="mt-10 bg-red-100">
             <Asignacion
          asignacion={asignacion}
          setAsignacion={setAsignacion}
          abonosAsignacion={abonosAsignacion}
          setAbonosAsignacion={setAbonosAsignacion}
          nuevoAbonoAsignacion={nuevoAbonoAsignacion}
          setNuevoAbonoAsignacion={setNuevoAbonoAsignacion}
          handleGuardarAsignacion={handleGuardarAsignacion}
          handleGuardarAbonoAsignacion={handleGuardarAbonoAsignacion}
          />    <ManoObra 
            manoObra={manoObra}
            setManoObra={setManoObra}
            handleGuardarManoObra={handleGuardarManoObra}
          />

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Detalle de Rendición</h3>
          <TablaRendicion
            items={items}
            handleChange={handleChange}
            agregarFila={() => setItems([...items, { fecha: '', detalle: '', folio: '', proveedor: '', documento: '', total: '' }])}
          />

          <h4 className="text-lg font-bold text-gray-800 mt-8 mb-4">Resumen</h4>
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700">Total de Rendición</h5>
            <p className="text-sm text-gray-600">
              {totalRendicion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>
          </div>
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700">Saldo Actual de Asignación</h5>
            <p className="text-sm text-gray-600">
              {saldoActualAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>
          </div>
          <div className="mb-4">
            <h5 className="text-sm font-medium text-gray-700">Saldo Final de Asignación</h5>
            <p className="text-sm text-gray-600">
              {saldoFinalAsignacion.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}
            </p>
          </div>
            </div>
            
          )}
          
        
 
        

     
        </div>
      </div>

      <ExportButtons exportToPDF={exportToPDF} exportToExcel={exportToExcel} />
    </div>
  );
};

export default Presupuesto;
