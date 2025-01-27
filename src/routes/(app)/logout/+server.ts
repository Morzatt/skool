import type { RequestHandler } from './$types';
import { clearSession } from '$lib/handlers/login.handler';
import { redirect } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
    let cookie = event.cookies.get("sessionId")
    if (!cookie) return new Response();

    await clearSession(cookie, event.locals.log)
    event.cookies.delete("sessionId", { path: "/" })

    event.locals.log.info({ msg: "SESION FINALIZADA" })
    redirect(307, "/auth")
};