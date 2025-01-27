import { pregSegRepository } from '$lib/database/repositories/preg_seg.repository';
import { usuarioRepository } from '$lib/database/repositories/user.repository';
import async from '$lib/utils/asyncHandler';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
    let { log } = locals

    let params = url.searchParams
    let username = params.get("username")

    let result = await async(usuarioRepository.getByUsername(String(username)), log)
    
    return result === undefined ? new Response("Disponible", { status: 200 }) : new Response("Ocupado", { status: 400 })
};

export const POST: RequestHandler = async ({ url, locals, request }) => {
    let { log } = locals
    let params = url.searchParams
    let username = params.get("username") as string
    try {
        let result = await async(pregSegRepository.get(username), log)
        return json({...result}, { status: 200 })
    } catch (error) {
        console.log(error)
        return json({ error: 'Error: ' }, { status: 500 }); 
    }
}