import type { PageServerLoad } from './$types';
import QRCode from 'qrcode'

export const load = (async () => {
    let qr = await QRCode.toDataURL('CARLOS ES EL TIPPP!', {
        errorCorrectionLevel: "H"
    })

    console.log(qr)
    return {qr};
}) satisfies PageServerLoad;