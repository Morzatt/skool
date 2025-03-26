import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';
import QRCode from 'qrcode'

export const load = (async ({locals}) => {
    let qr = await QRCode.toDataURL('2138', {
        errorCorrectionLevel: "H"
    })
    
    return { qr, usuario: locals.usuario };
}) satisfies PageServerLoad;

export const actions = {
    entrada: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()
        let entrada = {

        }
        console.log("entrada",data)
        return response.success('')
    },

    salida: async ({ locals, request }) => {
        let { log, response } = locals;
        let data = await request.formData()
        let salida = {

        }
        console.log("salida",data)
        return response.success('')
    }
} satisfies Actions