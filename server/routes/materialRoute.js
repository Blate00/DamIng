import { Router } from "express";
import { MaterialController } from "../controllers/materialController.js";

export const createMaterialRouter = ({ materialModel }) => {

    const materialRouter = Router()
    const materialController = new MaterialController ({ materialModel })

    materialRouter.get('/', materialController.getAll)
    materialRouter.get('/:id', materialController.getById )

    return materialRouter
}