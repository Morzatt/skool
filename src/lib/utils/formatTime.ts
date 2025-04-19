export default function formatTime(time: string): string {
    return new Date(`1990-01-01:${time}`).toLocaleTimeString('es', { hour12: true, timeStyle: "short" })
}