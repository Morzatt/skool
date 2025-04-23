export type Vigencia = 'Vigente' | 'Expirado' | 'Pendiente'

export function checkVigencia(inicio: string, final: string): Vigencia {
    let vigencia = ((new Date() > new Date(inicio))) && (new Date() < new Date(final))

    if (vigencia) {
        return 'Vigente'
    }

    if (!vigencia && (new Date() < new Date(inicio))) {
        return 'Pendiente'
    }

    return 'Expirado'
}