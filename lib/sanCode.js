/**
 * SAN Code (Fibonacci Nomenclature System)
 * 
 * The SAN Code assigns a unique numerical identifier to each species
 * within the Nahiara universe, based on the Fibonacci sequence applied
 * to the alphabet.
 * 
 * Categories:
 *   SAN-F-XXXXX → National flower
 *   SAN-P-XXXXX → Pollinator
 *   SAN-G-XXXXX → Symbolic guardian (future use)
 */

// Immutable Fibonacci value table for each letter
export const FIBONACCI_VALUES = Object.freeze({
    a: 1,
    b: 1,
    c: 2,
    d: 3,
    e: 5,
    f: 8,
    g: 13,
    h: 21,
    i: 34,
    j: 55,
    k: 89,
    l: 144,
    m: 233,
    n: 377,
    o: 610,
    p: 987,
    q: 1597,
    r: 2584,
    s: 4181,
    t: 6765,
    u: 10946,
    v: 17711,
    w: 28657,
    x: 46368,
    y: 75025,
    z: 121393,
});

/**
 * Calculate the raw SAN number from a scientific name.
 * Converts name to lowercase, sums Fibonacci values for each letter,
 * ignoring spaces, punctuation, and any non-letter characters.
 * 
 * @param {string} scientificName - The complete official scientific name
 * @returns {number} The SAN number
 */
export function calculateSAN(scientificName) {
    if (!scientificName || typeof scientificName !== "string") return 0;

    return scientificName
        .toLowerCase()
        .split("")
        .reduce((sum, char) => sum + (FIBONACCI_VALUES[char] || 0), 0);
}

/**
 * Format a number with commas as thousand separators.
 * 
 * @param {number} num - The number to format
 * @returns {string} Formatted number string (e.g., "83,003")
 */
export function formatNumber(num) {
    return num.toLocaleString("en-US");
}

/**
 * Format the full SAN code string.
 * 
 * @param {number} sanNumber - The raw SAN number
 * @param {"F"|"P"|"G"} category - The category code
 * @returns {string} Formatted SAN code (e.g., "SAN-F-83,003")
 */
export function formatSANCode(sanNumber, category = "F") {
    return `SAN-${category}-${formatNumber(sanNumber)}`;
}

/**
 * Compute the complete SAN code from a scientific name and category.
 * This is the primary convenience function.
 * 
 * @param {string} scientificName - The complete official scientific name
 * @param {"F"|"P"|"G"} category - F = Flower, P = Pollinator, G = Guardian
 * @returns {string} The complete SAN code (e.g., "SAN-F-83,003")
 */
export function computeSANCode(scientificName, category = "F") {
    const sanNumber = calculateSAN(scientificName);
    return formatSANCode(sanNumber, category);
}

/**
 * Parse a SAN code string back to its components.
 * 
 * @param {string} sanCode - e.g., "SAN-F-83,003"
 * @returns {{ prefix: string, category: string, number: number } | null}
 */
export function parseSANCode(sanCode) {
    if (!sanCode || typeof sanCode !== "string") return null;
    const match = sanCode.match(/^SAN-([FPG])-(.+)$/);
    if (!match) return null;
    return {
        prefix: "SAN",
        category: match[1],
        number: parseInt(match[2].replace(/,/g, ""), 10),
    };
}
