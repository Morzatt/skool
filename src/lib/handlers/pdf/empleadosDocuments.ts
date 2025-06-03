import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import path from "path"
import { formatStringWithDots } from "$lib";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
import type { Empleado, InfoContacto, InfoLaboral, InfoPersonal } from "$lib/database/types";
import { eachDayOfInterval, format, startOfMonth } from "date-fns";

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

export function createListaEmpleadosDocument(empleados: Empleado[]) {
    function generateTableBody() {
        var body: any[][] = [];
        var titulos = ['C.I', 'Nombre', 'Sexo', 'Edad', 'Departamento', 'Cargo', 'Turno']; // Static headers
        body.push(titulos); // Push headers to the body

        for (let e of empleados) {
            let fila = [
                `${e.nacionalidad === "Venezolano" ? "V-" : "E-"}${formatStringWithDots(e.cedula)}`,
                `${capitalizeFirstLetter(e.primer_nombre)} ${capitalizeFirstLetter(e.primer_apellido)}`,
                e.sexo,
                `${e.edad} Años`,
                e.departamento,
                e.cargo,
                e.turno
            ];

            body.push(fila.map(i => {
                return {
                    text: i,
                }
            })); // Push each row to the body
        }
        return body
    }
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerGobernacion.jpeg')
    // let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/images/logo.jpg')

    let date = new Date()

    const grupalDocDefinition: TDocumentDefinitions = {
        pageSize: "A3",
        header: [
            {
                columns: [
                    {
                        image: bannerGobernacionPath,
                        alignment: 'center',
                        width: 800
                    },
                ]
            }
        ],
        content: [
            {
                image: logoColegioPath,
                alignment: 'center',
                width: 100,
                margin: [0, 40, 0, 0]
            },
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA ESTADAL BOLIVARIANA “ANDRÉS BELLO”`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "LISTA DE EMPLEADOS",
                bold: true,
                margin: [0, 30, 0, 0],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                table: {
                    widths: '*',
                    body: generateTableBody()
                },
                margin: [0, 20, 0, 0],
                alignment: 'center'
            },
        ],

        footer: [
            {
                text: `Ciudad Bolivar, a los ${date.getDate()} dias del mes de ${(date.toLocaleDateString('es', { month: 'long' }))} del año ${date.getFullYear()}`,
                alignment: 'center'
            },
        ],

        styles: styles
    };
    return grupalDocDefinition
}

export function createEmpleadoDocDef(empleado: Empleado, info_personal: InfoPersonal | undefined, info_contacto: InfoContacto | undefined, info_laboral: InfoLaboral | undefined) {
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerGobernacion.jpeg')
    // let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/images/logo.jpg')

    let date = new Date()

    const grupalDocDefinition: TDocumentDefinitions = {
        pageSize: "A4",
        header: [
            {
                columns: [
                    {
                        image: bannerGobernacionPath,
                        alignment: 'center',
                        width: 600
                    },
                ]
            }
        ],
        content: [
            {
                image: logoColegioPath,
                alignment: 'center',
                width: 100,
                margin: [0, 30, 0, 0]
            },
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA ESTADAL BOLIVARIANA “ANDRÉS BELLO”`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "PLANILLA DE EMPLEADO",
                bold: true,
                margin: [0, 30, 0, 10],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                table: {
                    widths: '*',
                    body: [
                        [
                            {
                                text: [
                                    {
                                        text: [
                                            { text: 'NOMBRE COMPLETO: ', bold: true },
                                            { text: `${empleado.primer_nombre} ${empleado.segundo_nombre} ${empleado.primer_apellido} ${empleado.segundo_apellido} \n`, decoration: "underline" }
                                        ],
                                        margin: [0, 10, 0, 0],
                                        alignment: 'left'
                                    },
                                    {
                                        text: [
                                            { text: 'CÉDULA DE IDENTIDAD: ', bold: true },
                                            { text: `${empleado.nacionalidad[0]}-${formatStringWithDots(empleado.cedula)} \n`, decoration: "underline" }
                                        ],
                                        margin: [0, 10, 0, 0],
                                        alignment: 'left'
                                    },
                                    {
                                        text: [
                                            { text: 'DEPARTAMENTO: ', bold: true },
                                            { text: `${empleado.departamento} \n`, decoration: "underline" }
                                        ],
                                        margin: [0, 10, 0, 0],
                                        alignment: 'left'
                                    },
                                    {
                                        text: [
                                            { text: 'CARGO: ', bold: true },
                                            { text: `${empleado.cargo} \n`, decoration: "underline" }
                                        ],
                                        margin: [0, 10, 0, 0],
                                        alignment: 'left'
                                    },
                                ],
                                margin: [0, 10, 0, 0],
                                alignment: 'left',
                            },
                        ]
                    ],
                },
                margin: [0, 10, 0, 0],
                alignment: 'left',
            },

            // {
            //     text: [
            //         { text: 'NOMBRE COMPLETO: ', bold: true },
            //         { text: `${empleado.primer_nombre} ${empleado.segundo_nombre} ${empleado.primer_apellido} ${empleado.segundo_apellido}`, decoration: "underline" }
            //     ],
            //     margin: [0, 10, 0, 0],
            //     alignment: 'left'
            // },

            // {
            //     text: [
            //         { text: 'CÉDULA DE IDENTIDAD: ', bold: true },
            //         { text: `${empleado.nacionalidad[0]}-${formatStringWithDots(empleado.cedula)}`, decoration: "underline" }
            //     ],
            //     margin: [0, 10, 0, 0],
            //     alignment: 'left'
            // },

            // {
            //     text: [
            //         { text: 'DEPARTAMENTO: ', bold: true },
            //         { text: `${empleado.departamento}`, decoration: "underline" }
            //     ],
            //     margin: [0, 10, 0, 0],
            //     alignment: 'left'
            // },

            // {
            //     text: [
            //         { text: 'CARGO: ', bold: true },
            //         { text: `${empleado.cargo}`, decoration: "underline" }
            //     ],
            //     margin: [0, 10, 0, 0],
            //     alignment: 'left'
            // },

            {
                columns: [
                    {
                        width: '*',
                        text: [
                            {
                                text: "INFORMACION PERSONAL \n\n",
                                bold: true,
                                margin: [0, 30, 0, 10],
                                alignment: 'left',
                                decoration: 'underline'
                            },

                            {
                                text: [
                                    { text: 'FECHA DE NACIMIENTO: ', bold: true },
                                    { text: `${new Date(empleado.fecha_nacimiento).toLocaleDateString()} \n`, decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'EDAD: ', bold: true },
                                    { text: `${empleado.edad} \n`, decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'SEXO: ', bold: true },
                                    { text: `${empleado.sexo} \n`, decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'ESTADO CIVIL: ', bold: true },
                                    { text: info_personal && info_personal.estado_civil ? `${info_personal.estado_civil} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },
                            {
                                text: [
                                    { text: 'NIVEL ACADEMICO: ', bold: true },
                                    { text: info_personal && info_personal.nivel_academico ? `${info_personal.nivel_academico} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },
                        ]
                    },

                    {
                        width: '*',
                        text: [
                            {
                                text: "INFORMACION DE CONTACTO \n\n",
                                bold: true,
                                margin: [0, 30, 0, 10],
                                alignment: 'left',
                                decoration: 'underline'
                            },

                            {
                                text: [
                                    { text: 'TELÉFONO PERSONAL: ', bold: true },
                                    { text: info_contacto && info_contacto.telefono_personal ? `${info_contacto.telefono_personal} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'TELÉFONO DE HABITACION: ', bold: true },
                                    { text: info_contacto && info_contacto.telefono_habitacion ? `${info_contacto.telefono_habitacion} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'CORREO ELECTRONICO: ', bold: true },
                                    { text: info_contacto && info_contacto.correo_electronico ? `${info_contacto.correo_electronico} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'ESTADO CIVIL: ', bold: true },
                                    { text: info_contacto && info_contacto.direccion_habitacion ? `${info_contacto.direccion_habitacion} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },
                        ]
                    },
                ],
                margin: [0, 20, 0, 0]
            },

            {
                text: "INFORMACION LABORAL",
                bold: true,
                margin: [0, 30, 0, 10],
                alignment: 'left',
                decoration: 'underline'
            },
            {
                columns: [
                    {
                        width: '*',
                        text: [
                            {
                                text: [
                                    { text: 'FECHA DE INGRESO: ', bold: true },
                                    { text: info_laboral && info_laboral.fecha_ingreso ? `${new Date(info_laboral.fecha_ingreso).toLocaleDateString()} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'TIEMPO DE SERVICIO: ', bold: true },
                                    { text: info_laboral && info_laboral.tiempo_servicio ? `${info_laboral.tiempo_servicio} \n` : "No Especificado \n", decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'TURNO: ', bold: true },
                                    { text: `${empleado.turno} \n`, decoration: "underline" }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },

                            {
                                text: [
                                    { text: 'HORA DE ENTRADA: ', bold: true },
                                    {
                                        text: info_laboral && info_laboral.hora_entrada ? `${new Date(1995, 1, 1,
                                            parseInt(info_laboral.hora_entrada.slice(0, info_laboral.hora_entrada.lastIndexOf(':'))),
                                            parseInt(info_laboral.hora_entrada.slice(info_laboral.hora_entrada.lastIndexOf(':') + 1))
                                        ).toLocaleTimeString("ve", { hour12: true, hour: "2-digit", minute: "2-digit" })} \n` : "No Especificado \n", decoration: "underline"
                                    }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },
                            {
                                text: [
                                    { text: 'HORA DE SALIDA: ', bold: true },
                                    {
                                        text: info_laboral && info_laboral.hora_entrada ? `${new Date(1995, 1, 1,
                                            parseInt(info_laboral.hora_salida.slice(0, info_laboral.hora_salida.lastIndexOf(':'))),
                                            parseInt(info_laboral.hora_salida.slice(info_laboral.hora_salida.lastIndexOf(':') + 1))
                                        ).toLocaleTimeString("ve", { hour12: true, hour: "2-digit", minute: "2-digit" })} \n` : "No Especificado \n", decoration: "underline"
                                    }
                                ],
                                margin: [0, 0, 0, 0],
                                alignment: 'left'
                            },
                        ]
                    },
                ],
                margin: [0, 0, 0, 0]
            },
        ],

        footer: [
            {
                text: `Ciudad Bolivar, a los ${date.getDate()} dias del mes de ${(date.toLocaleDateString('es', { month: 'long' }))} del año ${date.getFullYear()}`,
                alignment: 'center'
            },
        ],

        styles: styles
    };
    return grupalDocDefinition
}