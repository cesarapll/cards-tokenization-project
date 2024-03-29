export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BadRequestError";
    }
}

export class ForbiddenError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
    }
}

export class NotFoundError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "NotFoundError";
    }
}

export class InternalServerError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InternalServerError";
    }
}

export class ErrorHandler {
    static buildErrorData(error: Error) {
        if (error instanceof BadRequestError) {
            return {
                statusCode: 400,
                message: error.message,
            };
        }
        if (error instanceof NotFoundError) {
            return {
                statusCode: 404,
                message: error.message,
            };
        }
        if (error instanceof ForbiddenError) {
            return {
                statusCode: 403,
                message: error.message,
            };
        }
        if (error instanceof InternalServerError) {
            return {
                statusCode: 500,
                message: error.message,
            };
        }

        return {
            statusCode: 500,
            message: error.message,
        };
    }
}