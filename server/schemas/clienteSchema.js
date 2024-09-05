import { z } from "zod";

const clienteSchema = z.object({
    username: z.string({
        invalid_type_error: "No es un username",
        required_error: "Username es requerido.",
    }),
    email: z.string({
        invalid_type_error: "No es un email",
        required_error: "Email es requerido.",
    }),
    contraseña: z.string({
        invalid_type_error: "No es una contraseña",
        required_error: "Contraseña es requerida.",
    }),
});

const clienteLoginSchema = z.object({
    username: z.string({
        invalid_type_error: "No es un username",
        required_error: "Username es requerido.",
    }),
    contraseña: z.string({
        invalid_type_error: "No es una contraseña",
        required_error: "Contraseña es requerida.",
    }),
});

export function validateCliente(input) {
    return clienteSchema.safeParse(input);
}

export function validatePartialCliente(input) {
    return clienteSchema.partial().safeParse(input);
}

export function validateClienteLogin(input) {
    return clienteLoginSchema.safeParse(input);
}