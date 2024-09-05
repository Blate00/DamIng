import { z } from "zod";

const marcaSchema = z.object({
    nombre: z.string({
        invalid_type_error: "No es un nombre",
        required_error: "Nombre es requerido.",
    }),
});

export function validateMarca(input) {
    return marcaSchema.safeParse(input);
}

export function validatePartialMarca(input) {
    return marcaSchema.partial().safeParse(input);
}