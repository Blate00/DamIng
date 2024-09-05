import z from "zod";

const ventaSchema = z.object({
    fecha: z.string().nullable().optional(),
    clienteID : z.number().int().positive(),
    estado : z.string().nullable().optional()
});

export function validateVenta(input) {
    return ventaSchema.safeParse(input);
}

export function validatePartialVenta(input) {
    return ventaSchema.partial().safeParse(input);
}


const detalleVentaSchema = z.object({
    ventaID: z.number().int().positive(),
    productoID: z.number().int().positive(),
    cantidad: z.number().int().positive(),
    precio: z.number().int().positive()
});

export function validateDetalleVenta(input) {
    return detalleVentaSchema.safeParse(input);
}

export function validatePartialDetalleVenta(input) {
    return detalleVentaSchema.partial().safeParse(input);
}

const pagoSchema = z.object({
    ventaID: z.number().int().positive(),
    buyOrder: z.string().nullable(),
    sessionId: z.string().nullable(),
    fecha: z.string().nullable().optional(),
    amount: z.number().int().positive(),
    metodoPagoID: z.number().int().positive(),
    estadoPago: z.string().nullable(),
    token: z.string().nullable(),
});

export function validatePago(input) {
    return pagoSchema.safeParse(input);
}

export function validatePartialPago(input) {
    return pagoSchema.partial().safeParse(input);
}
