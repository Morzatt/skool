import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { basePath } from '$lib';

export const load = (async ({ locals, url }) => {
    if (!url.pathname.includes("/settings/account")) {
        if (locals.usuario.role === "administrador"
            || locals.usuario.role === "admin"
            || locals.usuario.role === "superadmin") {
            return
        } else {
            redirect(307, "/")
        }
    }

    return {};
}) satisfies LayoutServerLoad;