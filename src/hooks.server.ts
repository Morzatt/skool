import { FormResponse } from "$lib/classes/responses.classes";
import { checkSession, clearSession } from "$lib/handlers/login.handler";
import logger from "$lib/utils/logger";
import type { Handle } from "@sveltejs/kit";
import { redirect } from "@sveltejs/kit";

export const handle = (async ({ resolve, event }) => {
    // Logger Setting
    event.locals.log = logger.child({
        url: event.url.pathname,
        href: formatHref(event.url.href)
    })

    // Response Setting
    event.locals.response = new FormResponse(formatHref(event.url.href))

    if (!event.url.pathname.startsWith("/auth")) {
        let cookie = event.cookies.get("sessionId")
        if (!cookie) redirect(307, "/auth");

        const session = await checkSession(cookie, event.locals.log)
        if (session === undefined) {
            await clearSession(cookie, event.locals.log)
            event.cookies.delete("sessionId", { path: "" })
            redirect(307, "/auth")
        }

        if (event.url.pathname.startsWith("/admin")) {
            if (session.data?.role !== "Administrador") {
                redirect(301, "/")
            }
        }
        
        if (session.data) {
            Reflect.deleteProperty(session.data, "contraseña")
            event.locals.usuario = session.data
            event.locals.log = event.locals.log.child({
                session_id: cookie,
                usuario: session.data.usuario
            })
        } 
    }

    const response = await resolve(event);
    return response;
}) satisfies Handle;

function formatHref(url: string): string {
    let lastIndex = url.lastIndexOf("/")
    return url.slice(lastIndex + 1)
}