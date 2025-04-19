import { db } from "$lib/database";
import type { DiasSemana, GradoID, HorarioGradoAlt, Materia } from "$lib/database/types";
import async from "$lib/utils/asyncHandler";
import type { RequestEvent } from "@sveltejs/kit";
import path from "path"
import { printHorario, printListadeAsistencias } from "./pdf";
import { unlinkSync } from "fs";

export type HorarioDay = HorarioGradoAlt & Omit<Materia, "id_materia"> & { nombre_profesor: string, apellido_profesor: string }
export type HorarioPrint = {
    hora_inicio: string,
    hora_fin: string,
    lunes: HorarioDay,
    martes: HorarioDay,
    miercoles: HorarioDay,
    jueves: HorarioDay,
    viernes: HorarioDay,
}

export async function printHorarioGrado({ locals, request }: RequestEvent) {
    let { log, response } = locals;
    let id = (await request.formData()).get('id_grado') as GradoID

    let result = await async(
        db
            .selectFrom('horarios_grados_alt')
            .where('horarios_grados_alt.id_grado', '=', id)
            .select([
                'horarios_grados_alt.cedula_profesor', 'horarios_grados_alt.dia_semana', 'horarios_grados_alt.hora_fin',
                'horarios_grados_alt.hora_inicio', 'horarios_grados_alt.id_grado', 'horarios_grados_alt.id_horario', 'horarios_grados_alt.id_materia'
            ])
            .innerJoin('empleados', 'empleados.cedula', 'horarios_grados_alt.cedula_profesor')
            .select(['primer_nombre as nombre_profesor', 'primer_apellido as apellido_profesor'])
            .innerJoin('materias', 'materias.id_materia', 'horarios_grados_alt.id_materia')
            .select(['materias.nombre_materia', 'materias.color'])
            .orderBy('horarios_grados_alt.hora_inicio')
            .execute()
        , log)

    if (!result) {
        return
    }

    function filterDia(dia: DiasSemana, bloque: { hora_inicio: string, hora_fin: string }) {
        let d = result!.filter((r) => {
            if (r.dia_semana === dia && r.hora_inicio === bloque.hora_inicio && r.hora_fin === r.hora_fin) {
                return r
            }
        })
        return d[0]
    }

    function createBloque(i: HorarioDay) {
        let bloque = { hora_inicio: i.hora_inicio, hora_fin: i.hora_fin }
        horario.push({
            hora_inicio: i.hora_inicio,
            hora_fin: i.hora_fin,
            lunes: filterDia("Lunes", bloque),
            martes: filterDia('Martes', bloque),
            miercoles: filterDia('Miercoles', bloque),
            jueves: filterDia('Jueves', bloque),
            viernes: filterDia('Viernes', bloque)
        })
    }


    let horario: HorarioPrint[] = []

    for (let i of result) {
        if (horario.length === 0) {
            createBloque(i)
        }

        let existingBloque = horario.filter((h) => {
            if (i.hora_inicio === h.hora_inicio && i.hora_fin === h.hora_fin) {
                return h
            }
        })

        if (existingBloque.length === 0) {
            createBloque(i)
        }
    }

    let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
    let temporalPath = path.join(process.cwd(), `/static/horarios/temporal/horario_${id}_${timeId}.pdf`)

    printHorario(horario, temporalPath)
    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success("Horario impreso correctamente", { horarioId: `${id}_${timeId}` })
}


export async function printAlumnosGrado({ request, locals }: RequestEvent) {
    let { log, response } = locals;
    let id = (await request.formData()).get('id_grado') as GradoID

    let alumnos = await async(
        db
        .selectFrom('alumnos')
        .innerJoin('grados_alumnos', 'grados_alumnos.id_alumno', 'alumnos.cedula_escolar')
        .where('grados_alumnos.id_grado', '=', id)
        .selectAll()
        .orderBy('alumnos.primer_apellido asc')
        .orderBy('alumnos.primer_nombre asc')
        .execute()
    , log)

    if (!alumnos) {
        return
    }


    let timeId = new Date().toISOString().replaceAll(' ', '').replaceAll(':', '').replaceAll('-', '').replaceAll('.', '')
    let temporalPath = path.join(process.cwd(), `/static/horarios/temporal/lista_${id}_${timeId}.pdf`)

    printListadeAsistencias(alumnos, temporalPath)

    setTimeout(() => {
        unlinkSync(temporalPath)
    }, 10000)

    return response.success("Asistencia impresa correctamente", { listaId: `${id}_${timeId}` })
}