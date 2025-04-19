export function getId(url: string): string {
    return url.slice(url.lastIndexOf("/") + 1)
}


export function createAsistenciaID(empleado: string, dia: string) {
    dia = dia.replaceAll('-', '').replaceAll('_', '')
    empleado = empleado.replaceAll('-', '').replaceAll('_', '')

    return `${empleado}_${dia}`
}