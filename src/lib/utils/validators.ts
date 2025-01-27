import { fail } from "@sveltejs/kit"
import z, { ZodError, ZodSchema, type SafeParseReturnType } from "zod"
import { capitalizeFirstLetter } from "./capitlizeFirstLetter"
import type pino from "pino"

// INPUT VALIDATION FUNCTION
export function validateObject(obj: object, schema: ZodSchema) {
    const result = schema.safeParse(obj)
    return result
}

export function formatFieldName(word: string) {
    let substrs = word.split("_")
    let result = ""
    for (let strs of substrs) {
       result = result.concat(capitalizeFirstLetter(strs).concat(" ")) 
    }
    return result
}

export function newValidationFailObject(error: ZodError<any>, log?: pino.Logger<never, boolean>) {
    let aditional: { campo: string, validation: string[] | undefined }[] = []
    let errors = error.flatten().fieldErrors
    for (let key in errors) {
        aditional.push({ campo: formatFieldName(key), validation: errors[key] })
    }
    log?.error({ msg: "Malformacion de datos, no pudieron ser validados.", datos: aditional }); 
    return fail(400, { success: false, type: "Warning", message: "Error de Validación", aditional: aditional });
}

// REGISTER
const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[\W])(?!.*\s).{8,32}$/
export const registerUserSchema = z.object({
    nombre: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(20, "Máximo de 20 caracteres").trim(),
    apellido: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 carácteres").max(20, "Máximo de 20 caracteres").trim(),
    // email: z.string().min(1, "Campo vacío.").email("Email no válido").trim(),
    usuario: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 carácteres").max(20, "Máximo de 20 caracteres").trim(),
    contraseña: z.string().min(1, "Campo vacío.").regex(passwordRegex, 
        `Su contraseña no cumple con los parametros de seguridad minimos: debe de contener al menos 
        8 caracteres, una letra mayuscula, una letra minuscula y un caracter especial.`)
})

export const pregsegSchema = z.object({
    usuario: z.string().min(1, "campo vacío.").min(4, "mínimo de 4 caracteres").max(20, "máximo de 20 caracteres").trim(),
    preg_1: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim(),
    res_1: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim().toLowerCase(),
    preg_2: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim(),
    res_2: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(200, "Máximo de 0 caracteres").trim().toLowerCase(),
})

// LOGIN
export const loginSchema = z.object({
    usuario: z.string().min(1, "Campo vacío.").trim(),
    contraseña: z.string().min(1, "Campo vacío.").trim(),
    captcha: z.string()
})

// Recovery Check
export const recoverySchema = z.object({
    usuario: z.string().min(1, "campo vacío.").max(30, "máximo de 30 caracteres").trim(),
    res_1: z.string().min(1, "Campo vacío.").trim(),
    res_2: z.string().min(1, "Campo vacío.").trim(),
    contraseña: z.string().min(1, "Campo vacío.").regex(passwordRegex, 
        `Su contraseña no cumple con los parametros de seguridad minimos: debe de contener al menos 
        8 caracteres, una letra mayuscula, una letra minuscula y un caracter especial.`)
})

function setAge(date: Date) {
    date.setFullYear(date.getFullYear() - 18)
    date.setMonth(0)
    date.setDate(1)
    return date
}
let underAgeDate = setAge(new Date())


// NUEVO DONANTE
export const newDonanteSchema= z.object({
    primer_nombre: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(100, "Máximo de 100 caracteres").trim().optional(),
    segundo_nombre: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(100, "Máximo de 100 caracteres").trim().optional(),
    primer_apellido: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(100, "Máximo de 100 caracteres").trim().optional(),
    segundo_apellido: z.string().min(1, "Campo vacío.").min(2, "Mínimo de 2 caracteres").max(100, "Máximo de 100 caracteres").trim().optional(),
    edad: z.number()
        .int("El número ingresado no debe contener puntos ni espacios, ni empezar por cero")
        .min(18, "La edad mínima para donar es de 18 años")
        .nonnegative("La cedula ingresada no puede ser un valor negativo")
        .max(60, "La edad maxima para donar es de 60 años").optional(),

    sexo: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(20, "Máximo de 20 caracteres").trim().optional(),
    lugar_nacimiento: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(100, "Máximo de 100 caracteres").trim().optional(),

    fecha_nacimiento: z.date()
        .max(underAgeDate, "Debe de ser mayor de edad para poder realizar una donación").optional(),

    cedula: z.number().int("El número ingresado no debe contener puntos ni espacios, ni empezar por cero").min(1, "").nonnegative("El numero ingresado no puede estar vacio").optional(),
    profesion: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(100, "Máximo de 100 caracteres").trim().optional(),
    ocupacion: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(100, "Máximo de 100 caracteres").trim().optional(),

    telefono_personal: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(15, "Máximo de 15 caracteres").trim().optional(),
    telefono_habitacion: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(15, "Máximo de 15 caracteres").trim().optional(),

    direccion_habitacion: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(150, "Máximo de 150 caracteres").trim().optional(), 
    direccion_trabajo: z.string().min(1, "Campo vacío.").min(4, "Mínimo de 4 caracteres").max(150, "Máximo de 150 caracteres").trim().optional()
})