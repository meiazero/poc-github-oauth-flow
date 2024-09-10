import { customAlphabet } from "nanoid";

export const nanoid = customAlphabet("123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz");

const prefixes = {
  queue: "que",
}

/**
 * Generates a new ID with the given prefix.
 * @param {string} prefix - The prefix to be added to the ID.
 * @returns {string} - The newly generated ID.
 */
export function newId(prefix: string): string {
  return [prefixes[prefix], nanoid(32)].join("_");
}