import type { Alumno, Empleado, Grado, GradoAlumno, GradoCursado } from "$lib/database/types";
import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import path from "path"
import { formatStringWithDots } from "$lib";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
import { formatGrado } from "$lib/utils/createGradoId";
import { getYear } from "$lib/utils/getSchoolarYear";

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

export function createBuenaConductaDocument(alumno: Alumno, grado: Grado & GradoAlumno | undefined, grado_cursado: GradoCursado | undefined, director: Empleado) {
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
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
                margin: [0, 20, 0, 0]
            },
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA  NACIONAL “ARMANDO REVERON”`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "CONSTANCIA DE BUENA CONDUCTA",
                bold: true,
                margin: [0, 20, 0, 0],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                text: [
                    `Quien suscribe, `,
                    { text: `${director.primer_nombre} ${director.primer_apellido},`, bold: true, decoration: 'underline' },
                    ` Director(a) de la U.E.N. “Armando Reverón”, hace constar  por  medio de la presente que el alumno(a)`,
                    { text: ` ${alumno.primer_nombre} ${alumno.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' C.E ',
                    { text: ` ${alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}${formatStringWithDots(alumno.cedula_escolar)}`, bold: true, decoration: 'underline'},
                    ` cursa ${grado ? formatGrado(grado) : grado_cursado?.grado} del año escolar ${grado_cursado ? getYear(grado_cursado.fecha) : getYear()}, en el turno de la ${capitalizeFirstLetter(grado?.turno)}.`
                ],
                margin: [0, 25, 0, 0],
                lineHeight: 2,
                alignment: 'justify'
            },
            {
                text: [
                    `Durante su permanencia en la institución se observó: `,
                    { text: "BUENA CONDUCTA", bold: true, decoration: 'underline' }
                ],
                margin: [0, 30, 0, 0]
            },
            {
                text: `Constancia que se expide a solicitud de la parte interesada en Ciudad Bolivar, a los ${date.getDate()} dias del mes de ${(date.toLocaleDateString('es', { month: 'long' }))} del año ${date.getFullYear()}`,
                margin: [0, 40, 0, 0]
            },
            {
                text: '_______________________________',
                margin: [0, 150, 0, 0],
                alignment: 'center'
            },
            {
                text: [
                    { text: `${director.primer_nombre} ${director.primer_apellido} \n` },
                    { text: `Director(a)` }
                ],
                alignment: 'center'
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

export function createConstanciaEstudioDocument(alumno: Alumno, grado: Grado & GradoAlumno | undefined, grado_cursado: GradoCursado | undefined, director: Empleado) {
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
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
                margin: [0, 20, 0, 0]
            },
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA  NACIONAL “ARMANDO REVERON”`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "CONSTANCIA DE ESTUDIO",
                bold: true,
                margin: [0, 30, 0, 0],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                text: [
                    `Quien suscribe, `,
                    { text: `${director.primer_nombre} ${director.primer_apellido},`, bold: true, decoration: 'underline' },
                    ` Director(a) de la U.E.N. “Armando Reverón”, hace constar  por  medio de la presente que el alumno(a)`,
                    { text: ` ${alumno.primer_nombre} ${alumno.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' C.E ',
                    { text: ` ${alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}${formatStringWithDots(alumno.cedula_escolar)}`, bold: true, decoration: 'underline'},
                    ` se instribió para cursar ${grado ? formatGrado(grado) : grado_cursado?.grado} del año escolar ${grado_cursado ? getYear(grado_cursado.fecha) : getYear()}, en el turno de la ${capitalizeFirstLetter(grado?.turno)} en dicha institución.`
                ],
                margin: [0, 25, 0, 0],
                lineHeight: 2,
                alignment: 'justify'
            },
            {
                text: `Constancia que se expide a solicitud de la parte interesada en Ciudad Bolivar, a los ${date.getDate()} dias del mes de ${(date.toLocaleDateString('es', { month: 'long' }))} del año ${date.getFullYear()}`,
                margin: [0, 40, 0, 0]
            },
            {
                text: '_______________________________',
                margin: [0, 150, 0, 0],
                alignment: 'center'
            },
            {
                text: [
                    { text: `${director.primer_nombre} ${director.primer_apellido} \n` },
                    { text: `Director(a)` }
                ],
                alignment: 'center'
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

export function createCartaAceptacionDocument(alumno: Alumno, grado: Grado & GradoAlumno | undefined, grado_cursado: GradoCursado | undefined, director: Empleado) {
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
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
                margin: [0, 20, 0, 0]
            },
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA  NACIONAL “ARMANDO REVERON”
                        CIUDAD BOLIVAR, ESTADO BOLIVAR
                        CÓDIGO DE DEPENDENCIA: 006590250`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "CARTA DE ACEPTACION",
                bold: true,
                margin: [0, 30, 0, 0],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                text: [
                    `Quien suscribe, `,
                    { text: `${director.primer_nombre} ${director.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' titular de la cédula de identidad',
                    { text: ` V-${formatStringWithDots(director.cedula)}`, bold: true, decoration: 'underline' },
                    ` Director(a) de la U.E.N. “Armando Reverón”, por medio de la presente hago saber que el alumno(a)`,
                    { text: ` ${alumno.primer_nombre} ${alumno.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' C.E ',
                    { text: ` ${alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}${formatStringWithDots(alumno.cedula_escolar)}`, bold: true, decoration: 'underline'},
                    ` fue aceptado para cursar el ${grado ? formatGrado(grado) : grado_cursado?.grado}, en el turno de la ${capitalizeFirstLetter(grado?.turno)} en esta institución educativa en el periodo del año escolar ${grado_cursado ? getYear(grado_cursado.fecha) : getYear()}.`
                ],
                margin: [0, 25, 0, 0],
                lineHeight: 2,
                alignment: 'justify'
            },
            {
                text: `Informacion que se emite en Ciudad Bolivar, a los ${date.getDate()} dias del mes de ${(date.toLocaleDateString('es', { month: 'long' }))} del año ${date.getFullYear()}`,
                margin: [0, 40, 0, 0]
            },
            {
                text: '_______________________________',
                margin: [0, 150, 0, 0],
                alignment: 'center'
            },
            {
                text: [
                    { text: `${director.primer_nombre} ${director.primer_apellido} \n` },
                    { text: `Director(a)` }
                ],
                alignment: 'center'
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

export function createConstanciaInscripcion(alumno: Alumno, grado: Grado & GradoAlumno | undefined, grado_cursado: GradoCursado | undefined, director: Empleado) {
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
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
                margin: [0, 20, 0, 0]
            },
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA  NACIONAL “ARMANDO REVERON”`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "CONSTANCIA DE INSCRIPCIÓN",
                bold: true,
                margin: [0, 30, 0, 0],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                text: [
                    `Quien suscribe, `,
                    { text: `${director.primer_nombre} ${director.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' titular de la cédula de identidad',
                    { text: ` V-${formatStringWithDots(director.cedula)}`, bold: true, decoration: 'underline' },
                    ` Director(a) de la U.E.N. “Armando Reverón”, hago constar por medio de la presente que el alumno(a)`,
                    { text: ` ${alumno.primer_nombre} ${alumno.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' C.E ',
                    { text: ` ${alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}${formatStringWithDots(alumno.cedula_escolar)}`, bold: true, decoration: 'underline'},
                    ` se inscribió para cursar el ${grado ? formatGrado(grado) : grado_cursado?.grado}, en el turno de la ${capitalizeFirstLetter(grado?.turno)} en esta institución educativa en el periodo del año escolar ${grado_cursado ? getYear(grado_cursado.fecha) : getYear()}.`
                ],
                margin: [0, 25, 0, 0],
                lineHeight: 2,
                alignment: 'justify'
            },
            {
                text: `Constancia que se expide a solicitud de la parte interesada en Ciudad Bolivar, a los ${date.getDate()} dias del mes de ${(date.toLocaleDateString('es', { month: 'long' }))} del año ${date.getFullYear()}`,
                margin: [0, 40, 0, 0]
            },
            {
                text: '_______________________________',
                margin: [0, 150, 0, 0],
                alignment: 'center'
            },
            {
                text: [
                    { text: `${director.primer_nombre} ${director.primer_apellido} \n` },
                    { text: `Director(a)` }
                ],
                alignment: 'center'
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

export function createConstanciaRetiro(alumno: Alumno, grado: Grado & GradoAlumno | undefined, grado_cursado: GradoCursado | undefined, director: Empleado) {
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
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
                margin: [0, 20, 0, 0]
            },
            {
                text: `REPUBLICA BOLIVARIANA DE VENEZUELA
                        MINISTERIO DEL PODER POPULAR PARA LA EDUCACIÓN
                        UNIDAD EDUCATIVA  NACIONAL “ARMANDO REVERON”`,
                bold: true,
                alignment: "center",
                margin: [0, 20, 0, 0],
                lineHeight: 1.5
            },

            {
                text: "CONSTANCIA DE RETIRO",
                bold: true,
                margin: [0, 30, 0, 0],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                text: [
                    `Quien suscribe, `,
                    { text: `${director.primer_nombre} ${director.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' titular de la cédula de identidad',
                    { text: ` V-${formatStringWithDots(director.cedula)}`, bold: true, decoration: 'underline' },
                    ` Director(a) de la U.E.N. “Armando Reverón”, hago constar por medio de la presente que el alumno(a)`,
                    { text: ` ${alumno.primer_nombre} ${alumno.primer_apellido},`, bold: true, decoration: 'underline' },
                    ' C.E ',
                    { text: ` ${alumno.nacionalidad === "Venezolano" ? "V-" : "E-"}${formatStringWithDots(alumno.cedula_escolar)}`, bold: true, decoration: 'underline'},
                    ` cursó el grado ${grado ? formatGrado(grado) : grado_cursado?.grado}, en el turno de la ${capitalizeFirstLetter(grado?.turno)} en esta institución educativa en el periodo del año escolar ${grado_cursado ? getYear(grado_cursado.fecha) : getYear()}.`
                ],
                margin: [0, 25, 0, 0],
                lineHeight: 2,
                alignment: 'justify'
            },
            {
                text: `Constancia que se expide a solicitud de la parte interesada en Ciudad Bolivar, a los ${date.getDate()} dias del mes de ${(date.toLocaleDateString('es', { month: 'long' }))} del año ${date.getFullYear()}`,
                margin: [0, 40, 0, 0]
            },
            {
                text: '_______________________________',
                margin: [0, 150, 0, 0],
                alignment: 'center'
            },
            {
                text: [
                    { text: `${director.primer_nombre} ${director.primer_apellido} \n` },
                    { text: `Director(a)` }
                ],
                alignment: 'center'
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

