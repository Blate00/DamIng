import { z } from "zod";

const materialSchema = z.object({
    nombre: z.string({
        invalid_type_error: "No es un nombre",
        required_error: "Nombre es requerido.",
    }),
});

export function validateMaterial(input) {
    return materialSchema.safeParse(input);
}  

export function validatePartialMaterial(input) {
    return materialSchema.partial().safeParse(input);
}