import { Router } from "express";
import { ClienteController } from "../controllers/clienteController.js";
import { authenticateToken } from '../middlewares/authMiddleware.js';

export const createClienteRouter = ({ clienteModel }) => {
  const clienteRouter = Router();
  const clienteController = new ClienteController({ clienteModel });

  clienteRouter.post('/login', clienteController.login);
  clienteRouter.post('/register', clienteController.create);
  clienteRouter.post('/logout', clienteController.logout);
  clienteRouter.get('/history', authenticateToken, clienteController.GetByHistory)

  clienteRouter.get('/me', authenticateToken, clienteController.getUser);

  return clienteRouter;
}
