import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { execSync } from "child_process"
import async, { handleError } from '$lib/utils/asyncHandler';
import { unlinkSync, writeFileSync } from 'fs';
import fs from "fs"
import path from 'path';
import * as tar from "tar"
import { cp, mkdir, rm, access, readdir, unlink } from 'fs/promises';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

function formatDate(date: Date): string {
    return date.toISOString().replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '').replaceAll('.', '');
}

export const actions = {
    generate: async ({ locals }) => {
        let { response, log } = locals
        let timestamp = formatDate(new Date())

        let backupFolderPath = path.join(process.cwd(), `/static/temporal/backup_${timestamp}`)
        let comprobantesFolderPath = path.join(process.cwd(), '/static/comprobantes')
        let backupPath = path.join(backupFolderPath, `/backup_${timestamp}.sql`)

        let tarPath = path.join(process.cwd(), `/static/backup_${timestamp}.tar`)

        try {
            // CREAR CARPETA TEMPORAL DE RESPALDO
            await async(mkdir(backupFolderPath), log)

            // CREAR RESPALDO SQL
            execSync(`mysqldump -u ${import.meta.env.VITE_MSUSER} --password=${import.meta.env.VITE_MSPASSWORD} -P ${import.meta.env.VITE_MSPORT || 3306} ${import.meta.env.VITE_MSDATABASE} > ${backupPath}`)

            // CARPETA DE COMPROBANTES DENTRO DE LA CARPETA DE RESPALDO
            await async(mkdir(path.join(backupFolderPath, '/comprobantes')), log)
        
            // COPIAR CARPETA DE RESPALDOS
            await cp(comprobantesFolderPath, path.join(backupFolderPath, '/comprobantes'), { recursive: true });

            // COMPRIMIR CARPETA DE RESPALDO
            tar.c({ 
                // gzip: false,
                file: tarPath,
                sync: true,
                portable: true,
                cwd: path.join(process.cwd(), '/static/temporal')
            }, [`backup_${timestamp}`])

        } catch (error) {
            handleError(log, error, {})
        }

        setTimeout(() => {
            unlinkSync(tarPath)
            rm(backupFolderPath, { recursive: true, force: true })
        }, 15000)

        return response.success('Copia de Seguridad creada correctamente.', { timestamp: timestamp })
    },

    upload: async ({ locals, request }) => {
        let { response, log } = locals
        let data = await request.formData()

        let backupUpload = data.get('backupUpload') as File
        if (!backupUpload.name.endsWith(".tar")) {
            return fail(400, response.error("El archivo seleccionado no es una archivo de respaldo compatible"));
        }

        let cwd = process.cwd()
        let temporalTarPath = path.join(cwd, `/static/temporal/${backupUpload.name}`)
        let backupID = backupUpload.name.slice(backupUpload.name.lastIndexOf('_') + 1, backupUpload.name.lastIndexOf('.'))

        try {
            writeFileSync(temporalTarPath, Buffer.from(await backupUpload.arrayBuffer()));

            tar.x({
                sync:true,
                file: temporalTarPath,
                cwd: path.join(process.cwd(), '/static/temporal')
            })

            await async(unlink(temporalTarPath), log)

            let backupFolderPath = path.join(cwd, `/static/temporal/backup_${backupID}`)
            let backupFilePath = path.join(backupFolderPath, `/backup_${backupID}.sql`)
            let backupComprobantesFolder = path.join(backupFolderPath, `/comprobantes`)
            let comprobantesPath = path.join(cwd, '/static/comprobantes')

            execSync(`mysql -u ${import.meta.env.VITE_MSUSER} --password=${import.meta.env.VITE_MSPASSWORD} -P ${import.meta.env.VITE_MSPORT || 3306} ${import.meta.env.VITE_MSDATABASE} < ${backupFilePath}`)

            await async(access(comprobantesPath), log)
            const items = await async(readdir(comprobantesPath), log);

            if (items && items.length > 0) {
                for (const item of items) {
                    const itemPath = path.join(comprobantesPath, item);
                    await async(rm(itemPath, { recursive: true, force: true }), log);
                }
            }

            await async(cp(backupComprobantesFolder, comprobantesPath, { recursive: true }), log)
            await async(rm(backupFolderPath, { recursive: true, force: true }), log)
        } catch (error) {
            handleError(log, error, {})
        }

        return response.success('Respaldo restaurado correctamente..')
    },
} satisfies Actions 