import express, { json } from 'express';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import { corsMiddleware } from './middlewares/cors.js';
import { createProductoRouter } from './routes/productoRoute.js';
import { createClienteRouter } from './routes/clienteRoute.js';
import { createCategoriaRouter } from './routes/categoriaRoute.js';
import { createMaterialRouter } from './routes/materialRoute.js';
import { createMarcaRouter } from './routes/marcaController.js';
import { createWebpayRouter } from './routes/webpayRoute.js';
import { createDetalleVentaRouter } from './routes/detalleVentaRoute.js';
import { createVentaRouter } from './routes/ventaRoute.js';

const JWT_SECRET = process.env.JWT_SECRET || 'this-is-an-awesome-secret-key-tiene-que-ser-mas-largo';

export const createApp = ({ productoModel, clienteModel, categoriaModel, marcaModel, materialModel, webpayModel, detalleVentaModel, ventaModel }) => {
  const app = express();

  app.use(json());
  app.use(corsMiddleware());
  app.use(cookieParser());

  app.use((req, res, next) => {
    const token = req.cookies.access_token;
    req.session = { user: null };

    if (token) {
      try {
        const data = jwt.verify(token, JWT_SECRET);
        req.session.user = data;
      } catch (err) {
        console.error('JWT verification error:', err);
      }
    }

    next();
  });

  app.disable('x-powered-by');

  // Montar routers
  app.use('/producto', createProductoRouter({ productoModel }));
  app.use('/', createClienteRouter({ clienteModel }));
  app.use('/categoria', createCategoriaRouter({ categoriaModel }));
  app.use('/marca', createMarcaRouter({ marcaModel }));
  app.use('/material', createMaterialRouter({ materialModel }));
  app.use('/webpay', createWebpayRouter({ webpayModel }));
  app.use('/detalleVenta', createDetalleVentaRouter({ detalleVentaModel }));
  app.use('/venta', createVentaRouter({ ventaModel }));


  const PORT = process.env.PORT || 1234;

  app.listen(PORT, () => {
    console.log(`Server en puerto http://localhost:${PORT}`);
  });
}