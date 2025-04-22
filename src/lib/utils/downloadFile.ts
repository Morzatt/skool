export function downloadFile(href: string, fileName: string) {
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName; // Set the desired filename
    link.click();
    link.remove()
}