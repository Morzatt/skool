import { db } from "$lib/database";
import async from "$lib/utils/asyncHandler";
import type { RequestEvent } from "@sveltejs/kit";
import path from "path"
import { printListadeAsistencias, printListadeEmpleados } from "./pdf";
import { unlinkSync } from "fs";
import { empleadosRepository } from "$lib/database/repositories/empleados.repository";
import fs from 'fs'
import { createCanvas, loadImage, registerFont } from 'canvas'
import QRCode from 'qrcode'
import { formatStringWithDots } from "$lib";
import { capitalizeFirstLetter } from "$lib/utils/capitlizeFirstLetter";


export type AsistenciaEmpleado = {
    nombre: string,
    cedula: string, 
    hora_entrada: string,
    hora_salida: string
}

export type AsistenciaDia = {
    fecha: Date,
    dia: string,
    empleados: AsistenciaEmpleado[]
}

export type AsistenciaDepartamento = {
    departamento: string,
    lapso: string,
    asistencias: AsistenciaDia[]
}

export async function printAsistenciasHandler({ locals, request, url }: RequestEvent) {
    const { log, response } = locals;
    const data = await request.formData();

    // Get date parameters with defaults
    const { startDate, endDate, dateRange } = getDateRange(data);
    
    // Query database for attendance records
    const records = await async(
        db
        .selectFrom('empleados')
        .rightJoin('asistencias', 'asistencias.empleado', 'empleados.cedula')
        .leftJoin('departamentos', 'departamentos.id_departamento', 'empleados.departamento')
        .selectAll()
        .where((eb) => eb.or([
            eb.and([
                eb('asistencias.fecha', '>=', startDate),
                eb('asistencias.fecha', '<=', endDate)
            ]),

            eb('asistencias.fecha', "is", null)
        ]))
        .orderBy('asistencias.fecha desc')
        .execute()
    , log
    );

    const timeId = generateTimeId();
    const pdfPath = path.join(process.cwd(), `/static/temporal/asistencias_${timeId}.pdf`);
    
    const departmentAttendance = processAttendanceRecords(records, dateRange);
    
    if (departmentAttendance.length < 1) {
        return response.error('No existen asistencias en el tiempo especificado');
    }
    
    printListadeAsistencias(departmentAttendance, pdfPath);
    
    // Schedule cleanup
    setTimeout(() => unlinkSync(pdfPath), 10000);
    
    return response.success("Horario impreso correctamente", { documentId: timeId });
}


export async function printListaEmpleadosHandler({ request, locals }: RequestEvent) {
    let { log, response } = locals;

    let empleados = await async(
        db
        .selectFrom('empleados')
        .selectAll()
        .select(eb => 
            eb.selectFrom('departamentos').select('departamentos.nombre_departamento')
            .whereRef('departamentos.id_departamento', '=', 'empleados.departamento').as('departamento')
        )
        .execute()
    , log)

    if (!empleados || empleados.length < 1) {
        return response.error('No existen empleados en la base de datos.')
    }

    const timeId = generateTimeId();
    const temporalPath = path.join(process.cwd(), `/static/temporal/lista_empleados_${timeId}.pdf`);
    printListadeEmpleados(empleados, temporalPath)
    setTimeout(() => unlinkSync(temporalPath), 10000);

    return response.success('Empleados obtenidos correctamente.', { fileId: timeId })
}

/**
 * Parse request data and calculate date range with defaults
 */
function getDateRange(formData: FormData) {
    const params = {
        startDate: formData.get('startDate') as string,
        endDate: formData.get('endDate') as string,
        search: formData.get('search') || '' as string,
        departamento: formData.get('departamento') || 'all' as string,
    };

    const today = new Date().toISOString().split('T')[0];

    // Set default dates if not provided
    const endDate = params.endDate
        ? new Date(params.endDate.replaceAll('-', '/'))
        : new Date(new Date(today).getFullYear(), new Date(today).getMonth() + 1, 0);

    const startDate = params.startDate
        ? new Date(params.startDate.replaceAll('-', '/'))
        : new Date(new Date(today).getFullYear(), new Date(today).getMonth(), 1);

    // Format for query and display
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];
    const dateRange = `${startDateStr} - ${endDateStr}`;

    return { startDate: startDateStr, endDate: endDateStr, dateRange };
}

/**
 * Generates a unique time-based ID
 */
function generateTimeId() {
    return new Date().toISOString()
        .replaceAll(' ', '')
        .replaceAll(':', '')
        .replaceAll('-', '')
        .replaceAll('.', '');
}

/**
 * Query database for attendance records
 */
async function fetchAttendanceRecords(startDate: string, endDate: string, log: any) {
    return 
}

/**
 * Process attendance records into department-based structure
 */
function processAttendanceRecords(records: any[], dateRange: string): AsistenciaDepartamento[] {
    if (!records || records.length === 0) {
        return [];
    }

    // First, group by department and day of week
    const departmentMap = groupByDepartmentAndDay(records);

    // Then convert to the final data structure
    return createFinalStructure(departmentMap, dateRange);
}

/**
 * Group records by department and day of week
 */
function groupByDepartmentAndDay(records: any[]) {
    const weekdays = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const departmentMap = new Map();

    for (const record of records) {
        // Get key data from record
        const departmentName = record.nombre_departamento;
        const dateStr = record.fecha;
        const date = new Date(dateStr);
        const dayOfWeek = weekdays[date.getDay()];

        // Create map entries if needed
        if (!departmentMap.has(departmentName)) {
            departmentMap.set(departmentName, new Map());
        }

        const dayMap = departmentMap.get(departmentName);
        if (!dayMap.has(dayOfWeek)) {
            dayMap.set(dayOfWeek, {
                empleados: [],
                fechas: [],
                fechaOriginal: dateStr
            });
        }

        // Add employee data
        const dayData = dayMap.get(dayOfWeek);
        dayData.empleados.push({
            nombre: `${record.primer_nombre} ${record.primer_apellido}`,
            cedula: record.cedula,
            hora_entrada: record.hora_entrada,
            hora_salida: record.hora_salida || ""
        });

        // Store date info
        dayData.fechas.push(date);
        dayData.fechaOriginal = dateStr; // Keep the most recent
    }

    return departmentMap;
}

/**
 * Convert the grouped data into the final structure
 */
function createFinalStructure(departmentMap: Map<string, any>, dateRange: string): AsistenciaDepartamento[] {
    const result: AsistenciaDepartamento[] = [];
    const orderedDays = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

    for (const [departmentName, dayMap] of departmentMap.entries()) {
        const departmentDays: AsistenciaDia[] = [];

        // Process each day in standard order
        for (const dayName of orderedDays) {
            if (dayMap.has(dayName)) {
                const dayData = dayMap.get(dayName);

                // Sort dates to get earliest
                const sortedDates = [...dayData.fechas].sort((a, b) => a.getTime() - b.getTime());

                // Create the attendance day object
                const attendanceDay: AsistenciaDia = {
                    fecha: sortedDates[0],
                    dia: dayName,
                    empleados: dayData.empleados
                };

                // Add original date string as extra property
                (attendanceDay as any).fechaOriginal = dayData.fechaOriginal;

                departmentDays.push(attendanceDay);
            }
        }

        result.push({
            departamento: departmentName,
            lapso: dateRange,
            asistencias: departmentDays
        });
    }

    return result;
}


export async function downloadIDHandler({ locals, request }: RequestEvent) {
    let { log, response } = locals;
    let data = await request.formData()
    let cedula = data.get('cedula') as string
    let color = data.get('color') as string

    let empleado = await async(
        db.selectFrom('empleados')
        .leftJoin('departamentos', 'departamentos.id_departamento', 'empleados.departamento')
        .selectAll()
        .where('empleados.cedula', '=', cedula)
        .executeTakeFirst()
    , log)


    if (!empleado) {
        return response.error('El empleado no se encuentra registrado')
    }
    function formatDate(date: Date): string {
        return date.toISOString().replaceAll('-', '').replaceAll(':', '').replaceAll(' ', '').replaceAll('.', '');
    }
    let timestamp = formatDate(new Date())

    const config = {
        width: 350, // Card width in pixels
        height: 550, // Card height in pixels
        outputFilename: `ID_${empleado.cedula}${timestamp}.png`,
        backgroundColor: '#FFFFFF', // White background
        primaryColor: color, // Orange color (approximated)
        textColor: '#000000', // Black text
        cardPadding: 15,
        cornerRadius: 20,
        logoPath: path.join(process.cwd(), '/static/temporal'), // Replace with your actual logo URL or local path
        logoSize: 50,
        topCircleSize: 20,
        qrCodeSize: 180,
        qrCodePadding: 10, // Padding inside the QR code border
        qrCodeBorderRadius: 15,
        qrCodeData: `${empleado.primer_nombre} ${empleado.primer_apellido}, ${empleado.cedula}, ${empleado.nombre_departamento}, ${empleado.cargo}`, 
        fontPath: null, // Optional: Path to a .ttf or .otf font file
        fontFamily: 'sans-serif', // Default font
        name: `${empleado.primer_nombre} ${empleado.primer_apellido}`,
        idNumber: `C.I: ${empleado.nacionalidad === "Venezolano" ? "V-" : "E-"} ${formatStringWithDots(empleado.cedula)}`,
        areaLabel: 'Area:',
        areaValue: empleado.nombre_departamento,
        cargoLabel: 'Cargo:',
        cargoValue: empleado.cargo,
        nameFontSize: 20,
        idFontSize: 14,
        detailFontSize: 14,
    };

    // --- Helper Function for Rounded Rectangles ---
    // Note: Newer canvas versions might have context.roundRect()
    function drawRoundedRect(ctx, x, y, width, height, radius) {
        if (width < 2 * radius) radius = width / 2;
        if (height < 2 * radius) radius = height / 2;
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    }

    // --- Main Function to Generate Card ---
    async function generateIdCard() {
        // Register custom font if provided
        if (config.fontPath && fs.existsSync(config.fontPath)) {
            try {
                registerFont(config.fontPath, { family: config.fontFamily });
            } catch (err) {
                config.fontFamily = 'sans-serif'; // Fallback
            }
        } else if (config.fontPath) {
            config.fontFamily = 'sans-serif'; // Fallback
        }


        // Create canvas
        const canvas = createCanvas(config.width, config.height);
        const ctx = canvas.getContext('2d');

        // 1. Draw Background
        ctx.fillStyle = config.backgroundColor;
        drawRoundedRect(ctx, 0, 0, config.width, config.height, config.cornerRadius);
        ctx.fill();
        // Add a subtle border for the card itself
        ctx.strokeStyle = '#E5E7EB'; // Light gray border
        ctx.lineWidth = 1;
        drawRoundedRect(ctx, 0.5, 0.5, config.width - 1, config.height - 1, config.cornerRadius);
        ctx.stroke();


        // 2. Draw Logo (Top Left)
        try {
            const logo = await loadImage(config.logoPath);
            const logoX = config.cardPadding;
            const logoY = config.cardPadding;
            // Draw circular logo
            ctx.save();
            ctx.beginPath();
            ctx.arc(logoX + config.logoSize / 2, logoY + config.logoSize / 2, config.logoSize / 2, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(logo, logoX, logoY, config.logoSize, config.logoSize);
            ctx.restore();
            // Add border to logo circle
            ctx.beginPath();
            ctx.arc(logoX + config.logoSize / 2, logoY + config.logoSize / 2, config.logoSize / 2, 0, Math.PI * 2, true);
            ctx.strokeStyle = config.primaryColor; // Orange border for logo
            ctx.lineWidth = 2;
            ctx.stroke();

        } catch (err) {
            console.error(`Error loading or drawing logo: ${err.message}`);
            // Draw a placeholder circle if logo fails
            ctx.fillStyle = '#E0E0E0'; // Gray placeholder
            ctx.beginPath();
            ctx.arc(config.cardPadding + config.logoSize / 2, config.cardPadding + config.logoSize / 2, config.logoSize / 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = config.primaryColor; // Orange border for placeholder
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // 3. Draw Top Orange Circle (Top Center)
        ctx.fillStyle = config.primaryColor;
        ctx.beginPath();
        const circleX = config.width / 2;
        const circleY = config.cardPadding + config.topCircleSize / 2;
        ctx.arc(circleX, circleY, config.topCircleSize / 2, 0, Math.PI * 2);
        ctx.fill();

        // 4. Draw QR Code Section
        const qrCodeTotalSize = config.qrCodeSize + config.qrCodePadding * 2;
        const qrBorderX = (config.width - qrCodeTotalSize) / 2;
        // Position QR code below the logo/top circle
        const qrBorderY = config.cardPadding + config.logoSize + 30; // Added spacing

        // 4a. Draw QR Code Border
        ctx.fillStyle = config.primaryColor; // Orange border background
        drawRoundedRect(ctx, qrBorderX, qrBorderY, qrCodeTotalSize, qrCodeTotalSize, config.qrCodeBorderRadius);
        ctx.fill();

        // 4b. Draw QR Code onto canvas
        const qrCodeX = qrBorderX + config.qrCodePadding;
        const qrCodeY = qrBorderY + config.qrCodePadding;
        try {
            // Create a temporary canvas for the QR code
            const qrCanvas = createCanvas(config.qrCodeSize, config.qrCodeSize);
            await QRCode.toCanvas(qrCanvas, empleado!.cedula, {
                width: config.qrCodeSize,
                margin: 1, // Margin within the QR code itself
                color: {
                    dark: '#000000', // Black modules
                    light: '#FFFFFF' // White background
                }
            });

            // Draw the generated QR code onto the main canvas
            ctx.drawImage(qrCanvas, qrCodeX, qrCodeY, config.qrCodeSize, config.qrCodeSize);
        } catch (err) {
            console.error(`Error generating QR code: ${err.message}`);
            // Draw placeholder if QR fails
            ctx.fillStyle = '#EEEEEE';
            ctx.fillRect(qrCodeX, qrCodeY, config.qrCodeSize, config.qrCodeSize);
            ctx.fillStyle = config.textColor;
            ctx.font = `12px ${config.fontFamily}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('QR Error', qrCodeX + config.qrCodeSize / 2, qrCodeY + config.qrCodeSize / 2);
        }


        // 5. Draw Name/ID Section
        const nameBgHeight = 60;
        const nameBgY = qrBorderY + qrCodeTotalSize + 15; // Position below QR code
        const nameBgX = config.cardPadding;
        const nameBgWidth = config.width - config.cardPadding * 2;

        // 5a. Draw Name Background Rectangle
        ctx.fillStyle = config.primaryColor; // Orange background
        drawRoundedRect(ctx, nameBgX, nameBgY, nameBgWidth, nameBgHeight, 10); // Smaller radius
        ctx.fill();

        // 5b. Draw Name and ID Text
        ctx.fillStyle = config.backgroundColor; // White text on orange bg
        ctx.textAlign = 'center';

        // Name
        ctx.font = `bold ${config.nameFontSize}px ${config.fontFamily}`;
        ctx.textBaseline = 'middle';
        const nameY = nameBgY + nameBgHeight * 0.4; // Adjust vertical position
        ctx.fillText(config.name, config.width / 2, nameY);

        // ID Number
        ctx.font = `${config.idFontSize}px ${config.fontFamily}`;
        const idY = nameBgY + nameBgHeight * 0.75; // Adjust vertical position
        ctx.fillText(config.idNumber, config.width / 2, idY);


        // 6. Draw Detail Text (Area, Cargo)
        ctx.fillStyle = config.textColor; // Black text
        ctx.textAlign = 'left';
        ctx.font = `bold ${config.detailFontSize}px ${config.fontFamily}`;
        ctx.textBaseline = 'top'; // Align text from the top

        const detailStartY = nameBgY + nameBgHeight + 20; // Position below name section
        const labelX = config.cardPadding + 5; // Indent labels slightly
        const valueX = labelX + 55; // Position for values

        // Area
        ctx.fillText(config.areaLabel, labelX, detailStartY);
        ctx.font = `${config.detailFontSize}px ${config.fontFamily}`; // Non-bold for value
        ctx.fillText(config.areaValue, valueX, detailStartY);

        // Cargo
        const cargoY = detailStartY + config.detailFontSize + 8; // Add spacing between lines
        ctx.font = `bold ${config.detailFontSize}px ${config.fontFamily}`; // Bold for label
        ctx.fillText(config.cargoLabel, labelX, cargoY);
        ctx.font = `${config.detailFontSize}px ${config.fontFamily}`; // Non-bold for value
        ctx.fillText(config.cargoValue, valueX, cargoY);

        // 7. Save Canvas to File
        try {
            const buffer = canvas.toBuffer('image/png');
            fs.writeFileSync(path.join(process.cwd(), '/static/temporal', config.outputFilename), buffer);
        } catch (err) {
            console.error(`Error saving image: ${err.message}`);
        }
    }

    // --- Run the generator ---
    generateIdCard().catch(err => {
        console.error("Failed to generate ID card:", err);
    });

    setTimeout(() => {
        unlinkSync(path.join(process.cwd(), '/static/temporal', config.outputFilename))
    }, 10000)

    return response.success('Identificacion creada correctamente', { id: `${empleado.cedula}${timestamp}` })
}