import type { StyleDictionary, TDocumentDefinitions } from "pdfmake/interfaces";
import { format } from 'date-fns';
import path from "path"
import type { AsistenciaDepartamento } from "../print.handlers";

// PDF styles
const styles: StyleDictionary = {
    header: {
        fontSize: 14,
        bold: true,
        fillColor: '#f4a460',
        color: 'white',
        alignment: 'center',
        margin: [0, 5, 0, 5]
    },
    subheader: {
        fontSize: 12,
        bold: true,
        fillColor: '#f4a460',
        color: 'white',
        margin: [0, 2, 0, 2]
    },
    tableHeader: {
        bold: true,
        fillColor: '#f4a460',
        color: 'white',
    }
};

/**
 * Creates a PDF document definition for attendance records
 */
export function createAsistenciaDocDefinition(asistencias: AsistenciaDepartamento[]): TDocumentDefinitions {
    // Path to logo image
    // const logoPath = path.join(process.cwd(), 'src/lib/handlers/pdf/images/logoColegio.jpg');

    let bannerGobernacionPath = path.join(process.cwd(), '/src/lib/handlers/pdf/images/bannerGobernacion.jpeg')
    let logoPath = path.join(process.cwd(), '/src/lib/images/logo.jpg')


    const header = [
        {
            columns: [
                {
                    image: bannerGobernacionPath,
                    alignment: 'center',
                    width: 600,
                    margin: [0,0,0,20]
                },
            ]
        }
    ]

    // Build document content
    const content: any[] = [
        createHeader(logoPath),
        ...createDepartmentSections(asistencias)
    ];
    
    // Return document definition
    return {
        pageSize: "A4",
        header: header,
        content,
        styles
    };
}

/**
 * Creates the document header with logo and school information
 */
function createHeader(logoPath: string) {
    return [
        {
            image: logoPath,
            alignment: 'center',
            width: 100,
            margin: [0, 20, 0, 0]
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
            text: "LISTA DE ASISTENCIAS",
            bold: true,
            margin: [0, 30, 0, 0],
            alignment: 'center',
            decoration: 'underline'
        },
    ]

}

/**
 * Creates attendance sections for each department
 */
function createDepartmentSections(asistencias: AsistenciaDepartamento[]) {
    return asistencias.flatMap(departamento => [
        // Department header
        createTableHeader('Informacion de Asistencia', [0, 20, 0, 0]),
        
        // Department info table
        createDepartmentInfoTable(departamento),
        
        // Attendance tables for each day
        ...createDailyAttendanceTables(departamento.asistencias)
    ]);
}

/**
 * Creates a single-row header table with styling
 */
function createTableHeader(text: string, margin: [number, number, number, number]) {
    return {
                        table: {
            widths: ['*'],
            body: [
                [{ text, alignment: 'center', fillColor: '#999999', color: 'white', bold: true }]
            ]
        },
        margin
    };
}

/**
 * Creates the department information table
 */
function createDepartmentInfoTable(departamento: AsistenciaDepartamento) {
    return {
        table: {
            widths: ['30%', '*'],
            body: [
                [
                    { text: 'Departamento', fillColor: '#999999', color: 'white', bold: true },
                    { text: departamento.departamento }
                ],
                [
                    { text: 'Lapso de Tiempo', fillColor: '#999999', color: 'white', bold: true },
                    { text: departamento.lapso }
                ]
            ]
        },
        margin: [0, 0, 0, 20] as [number, number, number, number]
    };
}

/**
 * Creates attendance tables for each day
 */
function createDailyAttendanceTables(asistencias: any[]) {
    return asistencias.flatMap(asistenciaDia => {
        // Format date for display - use the original date string if available

        return [
            // Date header
            createTableHeader(new Date(asistenciaDia.fechaOriginal).toLocaleDateString('es'), [0, 0, 0, 0]),
            
            // Day name header
            createTableHeader(asistenciaDia.dia, [0, 0, 0, 0]),
            
            // Attendance table
            createEmployeeAttendanceTable(asistenciaDia.empleados)
        ];
    });
}

/**
 * Formats a date for display, prioritizing original date string if available
 */
function formatDateForDisplay(asistenciaDia: any, fechaOriginal: string | undefined) {
    if (fechaOriginal) {
        return String(fechaOriginal).split('T')[0].replace(/-/g, '-').substring(2);
    }
    
    if (asistenciaDia.fecha instanceof Date) {
        return format(asistenciaDia.fecha, 'yy-MM-dd');
    }
    
    return String(asistenciaDia.fecha).split('T')[0].replace(/-/g, '-').substring(2);
}

/**
 * Creates the employee attendance table for a specific day
 */
function createEmployeeAttendanceTable(empleados: any[]) {
    return {
        table: {
            headerRows: 1,
            widths: ['5%', '30%', '25%', '20%', '20%'],
            body: [
                // Table header
                [
                    { text: '#', fillColor: '#f4a460', color: 'white', bold: true },
                    { text: 'Empleado', fillColor: '#f4a460', color: 'white', bold: true },
                    { text: 'Cedula', fillColor: '#f4a460', color: 'white', bold: true },
                    { text: 'Entrada', fillColor: '#f4a460', color: 'white', bold: true },
                    { text: 'Salida', fillColor: '#f4a460', color: 'white', bold: true }
                ],
                // Table rows for each employee
                ...empleados.map((empleado, index) => [
                    { text: (index + 1).toString() },
                    { text: empleado.nombre },
                    { text: empleado.cedula },
                    { text: empleado.hora_entrada },
                    { text: empleado.hora_salida }
                ])
            ]
        },
        margin: [0, 0, 0, 20] as [number, number, number, number]
    };
}