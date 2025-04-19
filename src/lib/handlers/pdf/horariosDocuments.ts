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


// Individual Document Definition 
export function createIndividualdDocDefinition(prestamo: PrestamoInfo) {
    const individualDocDefinition: TDocumentDefinitions = {

        info: {
            title: `Autorización de Prestamo - ${prestamo.nombre} ${prestamo.apellido} - ${prestamo.fecha}`,
            author: 'Caja de Ahorro de los Empleados, Jubilados y Pensionados Administrativos de la Gobernación del Estado Bolivar.',
        },

        content: [
            {
                columns: [
                    {
                        image: `src/middleware/pdf/images/logoGobernacion.png`,
                        width: 120, height: 60,
                        margin: [0, 0, 0, 0], alignment: "left",
                    },
                    {
                        text: `CAJA DE AHORRO DE LOS EMPLEADOS, JUBILADOS Y PENSIONADOS 
                                ADMINISTRATIVOS DE LA GOBERNACIÓN DEL ESTADO BOLIVAR 
                                (CAEJPA-GEB) Registro Nº 766 del Sector Público. Rif. Nº J-31336163-1`,
                        width: "auto",
                        bold: true,
                        fontSize: 10,
                        color: "#0032C4",
                        alignment: "center"
                    }
                ]
            },

            { text: `Ciudad Bolívar, ${prestamo.fecha}`, alignment: "right", margin: [0, 20, 0, 0] },
            { text: 'AUTORIZACIÓN', style: 'text_header', alignment: "center", margin: [0, 10, 0, 0] },

            {
                text: [
                    'Yo, ',
                    { text: `${prestamo.nombre} ${prestamo.apellido}, `, bold: true },
                    'titular de la Cédula de Identidad ',
                    { text: ` Nº ${prestamo.cedula}, `, bold: true },
                    `autorizo a la Caja de ahorro de los Empleados, Jubilados y Pensionados Administrativos de la Gobernación del Estado Bolívar (CAEJPA-GEB), a descontar por nómina el préstamo ESPECIAL solicitado`
                ],
                margin: [0, 20]
            },

            {
                table: {
                    widths: [200, 200],
                    heights: 20,
                    body: [
                        ['Monto Solicitado', `${prestamo.cantidad}Bs`],

                        ['Gastos Administrativos', `${prestamo.gastosAdministrativos}Bs`],
                        ['Servicio de Transferencia Efectiva', `${prestamo.servicioDeTransferencia}Bs`],
                        ['Porcentaje de Intereses', `${prestamo.porcentajeDeIntereses}%`],

                        ['Total en intereses', `${prestamo.montoDeIntereses}Bs`],

                        ['Tiempo de Pago', `${prestamo.tiempoDePago} Meses`],
                        ['Fiadores', ``],

                        ['Total Prestamo', `${prestamo.total}Bs`],
                        ['Cuota Mensual', `${prestamo.cuotaMensual}Bs`],
                        ['Cuota Quincenal', `${prestamo.cuotaQuincenal}Bs`],
                    ],
                },
                margin: [45, 40, 0, 0],
            },

            {
                margin: [0, 100, 0, 0],
                columns: [
                    {
                        width: "*",
                        alignment: "center",
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, // Starting x-coordinate
                                y1: 50, // Starting y-coordinate
                                x2: 150, // Ending x-coordinate (595 is the width of A4 paper)
                                y2: 50, // Ending y-coordinate
                                lineWidth: 1, // Line width
                                lineColor: 'black' // Line color
                            },
                        ],
                    },
                    {
                        width: "*",
                        alignment: "center",
                        canvas: [
                            {
                                type: 'line',
                                x1: 0, // Starting x-coordinate
                                y1: 50, // Starting y-coordinate
                                x2: 150, // Ending x-coordinate (595 is the width of A4 paper)
                                y2: 50, // Ending y-coordinate
                                lineWidth: 1, // Line width
                                lineColor: 'black' // Line color
                            }
                        ]
                    }
                ]
            },

            {
                margin: [0, 5, 0, 0],
                columns: [
                    {
                        width: "*",
                        text: "Firma Afiliado",
                        alignment: "center"
                    },
                    {
                        width: "*",
                        text: "Firma",
                        alignment: "center"
                    }
                ]
            },

            {
                text: [
                    `Dirección: Calle Bolívar, casco histórico, al lado de comercial Dia a Día, de la Plaza Farreras. Teléf.: 0285 – 4443763 – 0285 6329012. 
                    Correo electrónico: `,
                    { text: `caejpa_geb@hotmail.com, `, bold: true },
                    `Ciudad Bolívar, Edo. Bolívar`
                ],
                fontSize: 9,
                color: "#7C808A",
                margin: [0, 60]
            }

        ],

        styles: styles
    };

    return individualDocDefinition
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