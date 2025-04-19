import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { format, eachDayOfInterval, startOfMonth, endOfMonth } from 'date-fns';
import type { Alumno, GradoAlumno } from "$lib/database/types";
import { formatStringWithDots } from "$lib";
import path from "path"

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

export function createListaAsistenciasDocDefinition(alumnos: Array<Alumno & GradoAlumno>) {
    function generateTableBody() {
        let diasMes = obtenerDiasDelMesActual('dd')
        var body: any[][] = [];
        var titulos = [
            'N',
            'Nombres y Apellidos',
            'C.E',
            'S',
            ...diasMes
        ]; // Static headers
        body.push(titulos); // Push headers to the body

        for (let i = 0; i < alumnos.length; i++) {
            let fila = [
                `${i+1}`,
               `${alumnos[i].primer_apellido} ${alumnos[i].segundo_apellido}, ${alumnos[i].primer_nombre} ${alumnos[i].segundo_nombre}`,
               `${formatStringWithDots(alumnos[i].cedula_escolar)}`,
               {text: `${alumnos[i].sexo[0]}`, bold: true},
               ...diasMes.map(i => { return "" })
            ];
            body.push(fila); // Push each row to the body
        }
        return body
    }

    let logo = path.join(process.cwd(), 'src/lib/handlers/pdf/images/logoColegio.jpg')

    const grupalDocDefinition: TDocumentDefinitions = {
        pageSize: "A2",
        content: [
            {
                columns: [
                    {
                        image:  logo,
                        width: 120,
                        height: 80,
                        margin: [0, 0, 0, 0], alignment: "left",
                    },
                    {
                        text: `República Bolivariana de Venezuela
                                Ministerio del Poder Popular para la Educación
                                U.E.N Armando Reverón`,
                        width: "auto",
                        bold: true,
                        fontSize: 10,
                        alignment: "center"
                    },
                ]
            },

            { text: `Ciudad Bolívar, ${new Date().toLocaleDateString()}`, alignment: "right", margin: [0, 20, 0, 0] },

            {text: `Control de Asistencias`, margin: [0, 10, 0, 0], style: 'text_header',  },
            {text:'1er Grado Seccion "A"', style: 'text_subheader',  },
            {text:'Periodo 2024-2025', style: 'text_subheader',  },

            {
                margin: [0, 20, 0, 0],
                columns: [
                    {
                        width: '100%',
                        alignment: "center",
                        table: {
                            headerRows: 1,
                            body: generateTableBody()
                        }
                    }
                ]
            }
        ],
        styles: styles
    };
    return grupalDocDefinition
}

function obtenerDiasDelMesActual(formatType: string) {
  const fechaActual = new Date();
  const inicioMes = startOfMonth(fechaActual);
  const finMes = endOfMonth(fechaActual);
  
  const diasDelMes = eachDayOfInterval({
    start: inicioMes,
    end: finMes
  });
  
  // Formatear cada fecha como string (ejemplo: "2023-04-01")
  return diasDelMes.map(fecha => format(fecha, formatType));
}