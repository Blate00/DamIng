import { createApp } from './app.js'

import { ProductoModel } from './models/database/productoModel.js'
import { ClienteModel } from './models/database/clienteModel.js'
import { CategoriaModel } from './models/database/categoriaModel.js'
import { MarcaModel } from './models/database/marcaModel.js'
import { MaterialModel } from './models/database/materialModel.js'
import { webPayModel } from './models/database/webPayModel.js'
import { DetalleVentaModel } from './models/database/detalleVentaModel.js'
import { VentaModel } from './models/database/ventaModel.js'

createApp({ 
    productoModel: ProductoModel, 
    clienteModel: ClienteModel,
    categoriaModel: CategoriaModel, 
    marcaModel: MarcaModel, 
    materialModel: MaterialModel, 
    webpayModel: webPayModel, 
    detalleVentaModel: DetalleVentaModel,
    ventaModel: VentaModel,

})