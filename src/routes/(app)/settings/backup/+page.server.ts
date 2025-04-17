import { fail, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { execSync } from "child_process"
import async, { handleError } from '$lib/utils/asyncHandler';
import { unlinkSync, writeFileSync } from 'fs';
import fs from "fs"
import path from 'path';
import * as tar from "tar"
import { cp, mkdir, rm } from 'fs/promises';

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
        if (!backupUpload.name.endsWith(".tar.gz")) return fail(400, response.error("El archivo seleccionado no es una archivo de respaldo compatible"));

        writeFileSync(`static/${backupUpload.name}`, Buffer.from(await backupUpload.arrayBuffer()));
        execSync(`mysql -u ${import.meta.env.VITE_MSUSER} --password=${import.meta.env.VITE_MSPASSWORD} -P ${import.meta.env.VITE_MSPORT || 3306} ${import.meta.env.VITE_MSDATABASE} < ./static/${backupUpload.name}`)

        setTimeout(() => {
            unlinkSync(`static/${backupUpload.name}`)
        }, 5000)

        return response.success('Respaldo restaurado correctamente..')
    },

    folder: async ({ locals, request }) => {
        let { response, log } = locals
        let data = await request.formData()
        console.log('data', data)


        // Retrieve all uploaded files
        const files = data.getAll('files') as File[];
        // Process each file
        await Promise.all(
            files.map(async (file) => {
                // Derive output path from webkitRelativePath
                const relativePath = (file as any).webkitRelativePath || file.name;
                const outPath = path.join('static', 'uploads', relativePath);
                // Ensure directory exists
                await fs.promises.mkdir(path.dirname(outPath), { recursive: true });
                // Stream file to disk
                const buffer = Buffer.from(await file.arrayBuffer());
                await writeFile(outPath, buffer);
            })
        );

        return response.success('Respaldo restaurado correctamente..')
    }
} satisfies Actions 