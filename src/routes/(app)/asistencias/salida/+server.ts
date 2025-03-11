import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals, url }) => {
    let { log, response } = locals

    let data = await request.json()
    console.log(data)

    return new Response(JSON.stringify(response.success('Asistencia Tomada correctamente.')));
};