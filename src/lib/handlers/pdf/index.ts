import PdfPrinter from "pdfmake";
import fs from "fs"
import path from "path";
import type { AsistenciaDepartamento } from "../print.handlers";
import type { TDocumentDefinitions } from "pdfmake/interfaces";
import { createAsistenciaDocDefinition } from "./asistenciasDocuments";
import type { Empleado } from "$lib/database/types";
import { createListaEmpleadosDocument } from "./empleadosDocuments";

let fontPath = path.join(process.cwd(), `/src/lib/handlers/pdf/fonts`)

let fonts = {
    Roboto: {
        normal: `${fontPath}/Roboto-Regular.ttf`,
        bold: `${fontPath}/Roboto-Medium.ttf`,
        italics: `${fontPath}/Roboto-Italic.ttf`,
        bolditalics: `${fontPath}/Roboto-MediumItalic.ttf`
    }
};

const printer = new PdfPrinter(fonts);

export function print(docDef: TDocumentDefinitions, path: string) {
    const pdfDoc = printer.createPdfKitDocument(docDef);
    let res = pdfDoc.pipe(fs.createWriteStream(path));
    if (res.errored){
        throw res.errored
    }
    pdfDoc.end();
}

// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// 
// ASISTENCIAS
export function printListadeAsistencias(asistencias: AsistenciaDepartamento[], path: string) {
    const asistenciasDocDefinition = createAsistenciaDocDefinition(asistencias)
    print(asistenciasDocDefinition, path)
}

export function printListadeEmpleados(empleados: Empleado[], path: string) {
    const empleadosDocDefinition = createListaEmpleadosDocument(empleados)
    print(empleadosDocDefinition, path)
}