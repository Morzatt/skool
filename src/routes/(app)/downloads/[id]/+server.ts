import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import fs, { accessSync } from 'node:fs';
import path from 'node:path';
import async, { handleError } from '$lib/utils/asyncHandler';
import type pino from 'pino';
import type { FormResponse } from '$lib/classes/responses.classes';
import { access } from 'node:fs/promises';

type DownloadFunction = (uniqueId: string, TEMP_DIR: string, log: pino.Logger<never, boolean>, response: FormResponse) => Promise<Response | undefined>;

export const GET: RequestHandler = async ({ locals, params, url }) => {
    let { log, response } = locals;
    const id = params.id;
    const type = url.searchParams.get('type')

    if (type === "backup") {
        const TEMP_DIR = path.join(process.cwd(), '/static');
        return await downloadBackups(id, TEMP_DIR, log, response)
    }

    if (type === "comprobante") {
        const TEMP_DIR = path.join(process.cwd(), '/static');
        const filePath = url.searchParams.get('path') as string
        return await downloadComprobante(filePath, TEMP_DIR, log, response)
    }

    if (type === "asistencias") {
        const TEMP_DIR = path.join(process.cwd(), '/static/temporal');
        return await downloadAsistencia(id, TEMP_DIR, log, response)
    }

    if (type === "listaEmpleados") {
        const TEMP_DIR = path.join(process.cwd(), '/static/temporal');
        return await downloadListaEmpleados(id, TEMP_DIR, log, response)
    }
};

async function accessReadStream(path: string) {
    try {
        await access(path, fs.constants.F_OK)
        const fileStream = fs.createReadStream(path);
        return fileStream
    } catch (error) {
        throw error
    }
}

let downloadBackups: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `backup_${uniqueId}.tar`;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}


let downloadComprobante: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = uniqueId;
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadAsistencia: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `asistencias_${uniqueId}.pdf`;
    console.log(tempFileName)
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}

let downloadListaEmpleados: DownloadFunction = async (uniqueId, TEMP_DIR, log, response) => {
    const tempFileName = `lista_empleados_${uniqueId}.pdf`;
    console.log(tempFileName)
    const tempFilePath = path.join(TEMP_DIR, tempFileName);

    try {
        let fileStream = await async(accessReadStream(tempFilePath), log)
        return new Response(fileStream);
    } catch (e) {
        handleError(log, e, {})
    }
}