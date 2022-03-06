export function init(): Promise<void>;
/**
 * Use generic parameter only in case of getting array
 * @param path to configuration variable
 */
export function get<T>(path: string): string | number | Object | Array<T> | boolean | null;