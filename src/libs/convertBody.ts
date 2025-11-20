export function snakeToCamel(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamel(item));
    }

    const result: any = {};

    for (const key in obj) {
        const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
            letter.toUpperCase()
        );
        result[camelKey] = snakeToCamel(obj[key]);
    }

    return result;
}

export function camelToSnake(obj: any): any {
    if (obj === null || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
        return obj.map((item) => camelToSnake(item));
    }

    const result: any = {};

    for (const key in obj) {
        const snakeKey = key.replace(
            /[A-Z]/g,
            (letter) => `_${letter.toLowerCase()}`
        );
        result[snakeKey] = camelToSnake(obj[key]);
    }

    return result;
}
