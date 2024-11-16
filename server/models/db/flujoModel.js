const pool = require('../config');

const flujoModel = {

    getPaymentsByEmployee: async (employeeId) => {
        const query = `
          SELECT 
            ep.*,
            p.project_name,
            e.name as employee_name
          FROM employee_payments ep
          JOIN employees e ON e.employee_id = ep.employee_id
          JOIN projects p ON p.project_id = ep.project_id
          WHERE ep.employee_id = \$1
          ORDER BY ep.trabajo_fecha DESC
        `;
        try {
          const result = await pool.query(query, [employeeId]);
          return result.rows;
        } catch (error) {
          console.error('Error en getPaymentsByEmployee:', error);
          throw error;
        }
    },
  // Obtener todos los empleados
  getEmployees: async () => {
    const query = `
      SELECT employee_id, name
      FROM employees 
      ORDER BY name
    `;
    try {
      const result = await pool.query(query);
      return result.rows;
    } catch (error) {
      console.error('Error en getEmployees:', error);
      throw error;
    }
  },

  // Registrar un nuevo pago
  createPayment: async (paymentData) => {
    const {
      employee_id,
      project_id,
      quote_number,
      pago_dia,
      colacion,
      gestion,
      extra,
      trabajo_fecha
    } = paymentData;

    const query = `
      INSERT INTO employee_payments (
        employee_id,
        project_id,
        quote_number,
        pago_dia,
        colacion,
        gestion,
        extra,
        total_payment,
        trabajo_fecha
      ) VALUES (\$1, \$2, \$3, \$4, \$5, \$6, \$7, \$8, \$9)
      RETURNING *
    `;

    const total_payment = Number(pago_dia) + Number(colacion) + Number(gestion) + Number(extra);

    try {
      const values = [
        employee_id,
        project_id,
        quote_number,
        pago_dia,
        colacion,
        gestion,
        extra,
        total_payment,
        trabajo_fecha
      ];

      const result = await pool.query(query, values);

      // Actualizar el detalle acumulado de pagos
      await pool.query(`
        INSERT INTO employee_payment_details (employee_id, total_pagado)
        VALUES (\$1, \$2)
        ON CONFLICT (employee_id) 
        DO UPDATE SET 
          total_pagado = employee_payment_details.total_pagado + \$2,
          project_count = employee_payment_details.project_count + 1,
          last_payment_date = CURRENT_TIMESTAMP
      `, [employee_id, total_payment]);

      return result.rows[0];
    } catch (error) {
      console.error('Error en createPayment:', error);
      throw error;
    }
  },

  // Obtener pagos por proyecto
  getPaymentsByProject: async (projectId) => {
    const query = `
      SELECT 
        ep.*,
        e.name as employee_name
      FROM employee_payments ep
      JOIN employees e ON e.employee_id = ep.employee_id
      WHERE ep.project_id = \$1
      ORDER BY ep.trabajo_fecha DESC
    `;
    try {
      const result = await pool.query(query, [projectId]);
      return result.rows;
    } catch (error) {
      console.error('Error en getPaymentsByProject:', error);
      throw error;
    }
  }
};



module.exports = flujoModel;