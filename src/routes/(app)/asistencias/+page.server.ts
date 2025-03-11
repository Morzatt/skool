import type { PageServerLoad } from './$types';
import QRCode from 'qrcode'

export const load = (async () => {
    let qr = await QRCode.toDataURL('30451822', {
        errorCorrectionLevel: "H"
    })
    return { qr };
}) satisfies PageServerLoad;