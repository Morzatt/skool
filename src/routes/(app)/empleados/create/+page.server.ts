import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    create: async ({locals, request}) =>{
        let data = await request.formData()
        console.log(data)
    }
} satisfies Actions 
