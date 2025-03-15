import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { execSync } from "child_process"
import async, { handleError } from '$lib/utils/asyncHandler';
import { unlinkSync, writeFileSync } from 'fs';
import path from 'path';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

function formatDate(date: Date): string {
    return `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}`;
}

export const actions = {
    generate: async ({ locals }) => {
        let { response, log } = locals
        let timestamp = formatDate(new Date())
        try {
            execSync(`mysqldump -u ${import.meta.env.VITE_MSUSER} --password=${import.meta.env.VITE_MSPASSWORD} -P ${import.meta.env.VITE_MSPORT || 3306} ${import.meta.env.VITE_MSDATABASE} > ./static/backup_${timestamp}.sql`)
            setTimeout(() => {
                unlinkSync(path.join(process.cwd(), `/static/backup_${timestamp}.sql`))
            }, 5000)
        } catch (error) {
            handleError(log, error, {})
            return response.error("Ha ocurrido un error al intentar crear la copia de seguridad")
        }
        return response.success('Copia de Seguridad creada correctamente.', { timestamp: timestamp})
    },

    upload: async ({ locals, request }) => {
        let { response, log } = locals
        let data = await request.formData()
        let backupUpload = data.get('backupUpload') as File
        if (!backupUpload.name.endsWith(".sql")) return fail(400, response.error("El archivo seleccionado no es una archivo sql"));

        writeFileSync(`static/${backupUpload.name}`, Buffer.from(await backupUpload.arrayBuffer()));
        execSync(`mysql -u ${import.meta.env.VITE_MSUSER} --password=${import.meta.env.VITE_MSPASSWORD} -P ${import.meta.env.VITE_MSPORT || 3306} ${import.meta.env.VITE_MSDATABASE} < ./static/${backupUpload.name}`)

        setTimeout(() => {
            unlinkSync(`static/${backupUpload.name}`)
        }, 5000)

        return response.success('Respaldo restaurado correctamente..')
    }
} satisfies Actions 