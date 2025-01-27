import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { registerHandler } from '$lib/handlers/register.handler';
import { loginHandler } from '$lib/handlers/login.handler';
import captcha from "$lib/components/Captcha/svg-captcha"
import { options } from "$lib/components/Captcha/svg-captcha/lib/option-manager"
import { checkHandler, pregSegHandler, recoveryHandler } from '$lib/handlers/pregseg.handler';

export const load = (async () => {
    let { text, data } = captcha.create(options) 

    return { text, data };
}) satisfies PageServerLoad;

export const actions = {
    register: registerHandler,
    login: loginHandler,
    pregseg: pregSegHandler,
    check: checkHandler,
    recovery: recoveryHandler,
} satisfies Actions