import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import type { HorarioPrint } from "../print.handlers";
import path from "path"
import { formatTime } from "$lib/utils/formatTime";

const styles: StyleDictionary = {
    text_header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10] // margin: [izquierda, arriba, derecha, abajo]
    },
    text_subheader: {
        fontSize: 16,
        bold: true,
        margin: [0, 10, 0, 5]
    },
}

export function createHorario(horario: HorarioPrint[]) {
    function generateTableBody() {
        var body: any[][] = [];
        var titulos = ['Horas', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes']; // Static headers
        body.push(titulos); // Push headers to the body

        for (let h of horario) {
            let fila = [
                `${formatTime(h.hora_inicio)} - ${formatTime(h.hora_fin)}`,
                h.lunes? h.lunes.nombre_materia : "",
                h.martes    ? h.martes.nombre_materia : "",
                h.miercoles ? h.miercoles.nombre_materia : "",
                h.jueves    ? h.jueves.nombre_materia : "",
                h.viernes   ? h.viernes.nombre_materia : "",
            ];

            body.push(fila.map(i => {
                return {
                    text: i,
                }
            })); // Push each row to the body
        }
        return body
    }

    let logo = path.join(process.cwd(), 'src/lib/handlers/pdf/images/logoColegio.jpg')

    const grupalDocDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        content: [
            {
                columns: [
                    {
                        text: `República Bolivariana de Venezuela
                                Ministerio del Poder Popular para la Educación
                                U.E.N Armando Reverón`,
                        width: "auto",
                        bold: true,
                        fontSize: 10,
                        alignment: "left"
                    },
                    {
                        image:  logo,
                        width: 180, height: 120,
                        margin: [0, 0, 0, 0], alignment: "right",
                    },
                ]
            },
            { text: `Ciudad Bolívar, ${new Date().toLocaleDateString()}`, alignment: "right", margin: [0, 20, 0, 0] },
            { text: 'Año Escolar 2024-2025', alignment: "center", margin: [0, 10, 0, 0] },

            { text: 'Horario de Aula', style: 'text_header', alignment: "center", margin: [0, 10, 0, 10] },

            {
                alignment: "center",
                table: {
                    headerRows: 1,
                    body: generateTableBody()
                },
                
            },
        ],
        footer: {
            columns: [
                'Left part',
                { text: 'Right part', alignment: 'right' }
            ]
        },
        styles: styles
    };
    return grupalDocDefinition
}