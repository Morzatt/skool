export function generateUUID() {
    // Generate random values for each section
    const section1 = Math.floor(Math.random() * 0xFFFF);
    const section2 = Math.floor(Math.random() * 0xFFFF);
    const section3 = Math.floor(Math.random() * 0xFFFF);
    const section4 = Math.floor(Math.random() * 0xFFFF);
    
    // Convert to hexadecimal and pad with zeros
    return `${section1.toString(16).padStart(4, '0')}-${section2.toString(16).padStart(4, '0')}-${
        section3.toString(16).padStart(4, '0')}-${section4.toString(16).padStart(4, '0')}`;
}