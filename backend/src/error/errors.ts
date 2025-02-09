export class CustomError extends Error {
    public statusCode: number;
    public details?: any;

    constructor(message: string, statusCode: number, details?: any) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
    }
}

// 500 - Datenbankfehler
export class DatabaseError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 500, details);
    }
}


// Fehler für Validierungsprobleme
export class ValidationError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 400, details);
    }
}

// 401 Unauthorized
export class UnauthorizedError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 401, details);
    }
}

// 403 Forbidden
export class ForbiddenError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 403, details);
    }
}

// 404 Not Found
export class NotFoundError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 404, details);
    }
}

// 429 Too Many Requests
export class TooManyRequestsError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 429, details);
    }
}

// 422 Unprocessable Entity
export class UnprocessableEntityError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 422, details);
    }
}

//---------------------------------------------------------------------

// 500 Internal Server Error
export class InternalServerError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 500, details);
    }
}

// 502 Bad Gateway
export class BadGatewayError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 502, details);
    }
}

// 503 Service Unavailable
export class ServiceUnavailableError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 503, details);
    }
}

// 504 Gateway Timeout
export class GatewayTimeoutError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 504, details);
    }
}

// 501 Not Implemented
export class NotImplementedError extends CustomError {
    constructor(message: string, details?: any) {
        super(message, 501, details);
    }
}
