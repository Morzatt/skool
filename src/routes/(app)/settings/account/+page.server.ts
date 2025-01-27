import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { usuarioRepository } from '$lib/database/repositories/user.repository';
import async from '$lib/utils/asyncHandler';
import type { InsertPregSeg, UpdatePregSeg } from '$lib/database/types';
import { pregSegRepository } from '$lib/database/repositories/preg_seg.repository';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions = {
    editUser: async ({ request, locals }) => {
        let { log, response } = locals

        const data = await request.formData()
        const usuario = data.get("usuario") as string

        let form = {
            nombre: data.get("nombre"),
            apellido: data.get("apellido"),
        } as { nombre: string, apellido: string }

        // let usuarioFromDB = await async(usuarioRepository.getByUsername(usuario), log)
        await async(usuarioRepository.update({ ...form }, usuario), log)
        log.info(form)
    },

    editPregSeg: async ({request, url, locals}) => {
        let { log, response } = locals
        let data = await request.formData()
        const usuario = data.get("usuario") as string
        // let pregsegFromDB = await async(pregSegRepository.get(usuario), log)

        let form = {
            res_1: data.get("res_1") as string,
            res_2: data.get("res_2") as string,
            preg_1: data.get("preg_1") as string,
            preg_2: data.get("preg_2") as string,
            usuario: data.get("usuario") as string
        } satisfies UpdatePregSeg | InsertPregSeg 

        await async(pregSegRepository.update({ ...form }, usuario), log)
    }
} satisfies Actions