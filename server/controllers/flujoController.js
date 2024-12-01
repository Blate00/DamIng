const flujoModel = require('../models/db/flujoModel');

const flujoController = {
  getEmployees: async (req, res) => {
    try {
      const employees = await flujoModel.getEmployees();
      res.json(employees);
    } catch (error) {
      console.error('Error al obtener empleados:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener la lista de empleados'
      });
    }
  },

  createPayment: async (req, res) => {
    try {
      const paymentData = req.body;
      
      if (!paymentData.employee_id || !paymentData.project_id || !paymentData.trabajo_fecha) {
        return res.status(400).json({
          success: false,
          error: 'Faltan datos requeridos'
        });
      }

      const payment = await flujoModel.createPayment(paymentData);
      
      res.status(201).json({
        success: true,
        data: payment,
        message: 'Pago registrado exitosamente'
      });
    } catch (error) {
      console.error('Error al registrar pago:', error);
      res.status(500).json({
        success: false,
        error: 'Error al registrar el pago'
      });
    }
  },

  getProjectPayments: async (req, res) => {
    try {
      const { projectId } = req.params;
      const payments = await flujoModel.getPaymentsByProject(projectId);
      
      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error al obtener pagos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener los pagos del proyecto'
      });
    }
  },
  // En flujoController.js
getQuotePayments: async (req, res) => {
  try {
    const { quoteNumber } = req.params;
    const payments = await flujoModel.getPaymentsByQuoteNumber(quoteNumber);

    res.json({
      success: true,
      data: payments
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener los pagos de la cotización'
    });
  }
},
getEmployeePayments: async (req, res) => {
    try {
      const { employeeId } = req.params;
      const payments = await flujoModel.getPaymentsByEmployee(employeeId);
      
      res.json({
        success: true,
        data: payments
      });
    } catch (error) {
      console.error('Error al obtener pagos del empleado:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener los pagos del empleado'
      });
    }}

};


module.exports = flujoController;