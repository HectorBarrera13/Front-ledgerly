export class PresentableError extends Error {
    title: string;
    description: string;
    constructor(title: string, description: string) {
        super(`${title}: ${description}`);
        this.title = title;
        this.description = description;
    }
}
