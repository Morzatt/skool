import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import path from "path"
import { formatStringWithDots } from "$lib";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";
import type { Empleado } from "$lib/database/types";

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

