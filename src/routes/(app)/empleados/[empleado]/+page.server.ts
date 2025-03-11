import async from '$lib/utils/asyncHandler';
import { getId } from '$lib/utils/getId';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/database';
import QRCode from "qrcode"

export const load: PageServerLoad = (async ({ url, locals }) => {
    const { log, response } = locals;

    let cedula_empleado = getId(url.pathname)

    let empleado = await async(
        db
        .selectFrom('empleados')
        .innerJoin('departamentos', 'empleados.departamento', 'departamentos.id_departamento')
        .selectAll()
        .where('cedula', "=", cedula_empleado)
        .executeTakeFirst()
    ,log)

    if (!empleado) {
        error(404, 'El empleado no existe')
    }

    let qr = await QRCode.toDataURL(empleado.cedula, {
        errorCorrectionLevel: "H"
    })

    return { empleado, qr }
});

