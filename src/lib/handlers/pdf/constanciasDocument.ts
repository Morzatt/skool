// import type { Alumno, Empleado, Grado, GradoAlumno, GradoCursado } from "$lib/database/types";
import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import path from "path"
import { formatStringWithDots } from "$lib";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
// import { formatGrado } from "$lib/utils/createGradoId";
// import { getYear } from "$lib/utils/getSchoolarYear";

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

export function createAsistenciaDocumentDefinition() {
    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerMinisterio.jpg')
    let logoColegioPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/logoColegio.jpg')
    let date = new Date()

    const grupalDocDefinition: TDocumentDefinitions = {
        pageSize: "A3",
        header: [
            {
                columns: [
                    {
                        image: bannerGobernacionPath,
                        alignment: 'center',
                        width: 850
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
                text: "ASISTENCIAS",
                bold: true,
                margin: [0, 30, 0, 10],
                alignment: 'center',
                decoration: 'underline'
            },

            {
                table: {
                    widths: ['*'],
                    body: [

                    ]
                }
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

