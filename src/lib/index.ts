export let basePath = "";

export function showPwd(id: string) {
    let input = document.getElementById(id) as HTMLInputElement;
    input?.type === "text" ? input.type = "password" : input.type = "text";
}

export function formatDateDDMMYY(date: Date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear().toString().substr(-2); // Get the last two digits of the year
    return `${day}/${month}/${year}`;
}

export function formatDateYYMMDDHHMMSS(date: Date): string {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
}

export function formatStringWithDots(input: string) { return input.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.") }