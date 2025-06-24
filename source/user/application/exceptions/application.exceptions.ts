// Excepciones simples de aplicación
export class RepositoryError extends Error {
    constructor(operation: string, entity: string) {
        super(`Repository error: ${operation} ${entity}`);
        this.name = 'RepositoryError';
    }
}
