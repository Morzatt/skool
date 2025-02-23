import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { basePath } from '$lib';

export const load = (async ({ locals, url }) => {
    if (!url.pathname.includes("/settings/account")) {
        if (locals.usuario.role.toLowerCase().includes('admin')) {
            return
        } else {
            redirect(307, "/")
        }
    }

    return {};
}) satisfies LayoutServerLoad;