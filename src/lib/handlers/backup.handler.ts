import { fail, type RequestEvent } from '@sveltejs/kit';
import { usuarioRepository, type UsuarioRepositoryInterface } from '$lib/database/repositories/user.repository';
import type { NewUsuario } from '$lib/database/types';
import { unlinkSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { VITE_PGDATABASE, VITE_PGUSER } from '$env/static/private';
import path from 'path';
import { postgresPool } from '$lib/database';

function formatDate(date: Date): string {
    return `${date.getFullYear()}_${date.getMonth() + 1}_${date.getDate()}_${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getMilliseconds()}`;
}

async function produceDumpFile(timestamp: string) {
    await postgresPool.connect()
    try {
        const result = await postgresPool.query(`pg_dump -d ${import.meta.env.VITE_PGDATABASE} > ./static/backup_${timestamp}.sql`);
        console.log('Database dump successful');
    } catch (err) {
        console.error('Error:', err);
    }
}

export async function createBackupHandler(
    { request }: RequestEvent,
    repository: UsuarioRepositoryInterface = usuarioRepository,
) {
    let timestamp = formatDate(new Date())
    // execSync(`psql -U ${VITE_PGUSER} -d ${VITE_PGDATABASE} > ./static/backup_${timestamp}.sql`)
    await produceDumpFile(timestamp)

    setTimeout(() => {
        unlinkSync(path.join(process.cwd(), `/static/backup_${timestamp}.sql`))
    }, 5000)

    return { success: true, form: "generate", timestamp: timestamp}
}

export async function uploadBackupHandler(
    { request }: RequestEvent,
    repository: UsuarioRepositoryInterface = usuarioRepository,
    mock?: {formData: NewUsuario }
) {
    let formData = Object.fromEntries(await request.formData())
    let { backupUpload } = formData as { backupUpload: File }

    if (!backupUpload.name.endsWith(".sql")) return fail(400, { success: false, type: "Error", message: "El archivo seleccionado no es una archivo sql" });
    writeFileSync(`static/${backupUpload.name}`, Buffer.from(await backupUpload.arrayBuffer()));

    execSync(`psql -U ${VITE_PGUSER} -d ${VITE_PGDATABASE} < ./static/${backupUpload.name}`)

    setTimeout(() => {
        unlinkSync(`static/${backupUpload.name}`)
    }, 5000)

    return { success: true, type: "Success", message: "Solicitud procesada con éxito!" };
}