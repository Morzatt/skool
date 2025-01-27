import { loginSchema, newValidationFailObject, validateObject } from '$lib/utils/validators';
import { usuarioRepository, type UsuarioRepositoryInterface } from '$lib/database/repositories/user.repository';
import { sessionsRepository, type SessionsRepositoryInterface } from '$lib/database/repositories/sessions.repository';
import type { Session } from '$lib/database/types';
import { formatDateYYMMDDHHMMSS as formatDate } from '$lib';

// Libraries Imports
import { compareSync } from "bcrypt";
import { fail, type RequestEvent } from '@sveltejs/kit';
import { getFormData } from '$lib/utils/getFormData';
import async from '$lib/utils/asyncHandler';
import type pino from 'pino';

export async function loginHandler(
    { request, cookies, locals }: RequestEvent,
    ur: UsuarioRepositoryInterface = usuarioRepository,
    sr: SessionsRepositoryInterface = sessionsRepository,
    mock?: { formData: { usuario: string, contraseña: string } }
) {
    let { log, response } = locals

    let usuario: { usuario: string, contraseña: string, captcha: "true" | "false" } = {
        usuario: "",
        contraseña: "",
        captcha: "false"
    }
    await getFormData(usuario, request, mock)

    let result = validateObject(usuario, loginSchema);
    if (!result.success) { return newValidationFailObject(result.error, log); }

    if (usuario.captcha !== "true") { return fail(400, response.error("El captcha no coincide. Intente de nuevo.")); }

    const dbuser = await async(ur.getByUsername(usuario.usuario), log, { usuario: usuario.usuario })

    if (dbuser === undefined || null) {
        return fail(400, response.error("El usuario no se encuentra registrado."));
    }

    if (dbuser?.estado === "Bloqueado") {
        return fail(400, response.error("El usuario no puede iniciar sesión porque su acceso ha sido bloqueado."));
    }

    const auth = compareSync(usuario.contraseña, dbuser?.contraseña!)
    if (!auth) {
        return fail(400, response.error("Contraseña incorrecta."));
    }

    Reflect.deleteProperty(dbuser, "contraseña")

    let sessionArgs = {
        usuario: dbuser.usuario,
        expires_at: setExpiryDate(3, "hours"),
        data: JSON.stringify(dbuser)
    }
    let session = await async(sr.create(sessionArgs), log, sessionArgs)

    cookies.set("sessionId", session!.id, {
        path: "/",
        maxAge: 60 * 60 * 60 * 3,
    })
    log.info({ msg: `SESION CREADA PARA EL USUARIO ${usuario.usuario}`, usuario: usuario.usuario, session: session?.id })

    return response.success("Inicio de Sesión Exitoso.")
}

function setExpiryDate(time: number, type: "minutes" | "seconds" | "hours"): string {
    let date = new Date()
    switch (type) {
        case "hours":
            date.setHours(date.getHours() + time)
            return formatDate(date)
        case "minutes":
            date.setHours(date.getMinutes() + time)
            return formatDate(date)
        case "seconds":
            date.setHours(date.getSeconds() + time)
            return formatDate(date)
    }
}

export async function checkSession(sessionId: string, log: pino.Logger<never, boolean>, sr: SessionsRepositoryInterface = sessionsRepository): Promise<Session | undefined> {
    let result = await async(sr.get(sessionId), log, { sessionId })
    return result
}

export async function clearSession(sessionId: string, log: pino.Logger<never, boolean>, sr: SessionsRepositoryInterface = sessionsRepository): Promise<void> {
    let result = await async(sr.delete(sessionId), log, { sessionId })
}