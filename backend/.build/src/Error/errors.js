"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotImplementedError = exports.GatewayTimeoutError = exports.ServiceUnavailableError = exports.BadGatewayError = exports.InternalServerError = exports.UnprocessableEntityError = exports.TooManyRequestsError = exports.NotFoundError = exports.ForbiddenError = exports.UnauthorizedError = exports.ValidationError = exports.DatabaseError = exports.CustomError = void 0;
class CustomError extends Error {
    constructor(message, statusCode, details) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        this.details = details;
    }
}
exports.CustomError = CustomError;
// 500 - Datenbankfehler
class DatabaseError extends CustomError {
    constructor(message, details) {
        super(message, 500, details);
    }
}
exports.DatabaseError = DatabaseError;
// Fehler für Validierungsprobleme
class ValidationError extends CustomError {
    constructor(message, details) {
        super(message, 400, details);
    }
}
exports.ValidationError = ValidationError;
// 401 Unauthorized
class UnauthorizedError extends CustomError {
    constructor(message, details) {
        super(message, 401, details);
    }
}
exports.UnauthorizedError = UnauthorizedError;
// 403 Forbidden
class ForbiddenError extends CustomError {
    constructor(message, details) {
        super(message, 403, details);
    }
}
exports.ForbiddenError = ForbiddenError;
// 404 Not Found
class NotFoundError extends CustomError {
    constructor(message, details) {
        super(message, 404, details);
    }
}
exports.NotFoundError = NotFoundError;
// 429 Too Many Requests
class TooManyRequestsError extends CustomError {
    constructor(message, details) {
        super(message, 429, details);
    }
}
exports.TooManyRequestsError = TooManyRequestsError;
// 422 Unprocessable Entity
class UnprocessableEntityError extends CustomError {
    constructor(message, details) {
        super(message, 422, details);
    }
}
exports.UnprocessableEntityError = UnprocessableEntityError;
//---------------------------------------------------------------------
// 500 Internal Server Error
class InternalServerError extends CustomError {
    constructor(message, details) {
        super(message, 500, details);
    }
}
exports.InternalServerError = InternalServerError;
// 502 Bad Gateway
class BadGatewayError extends CustomError {
    constructor(message, details) {
        super(message, 502, details);
    }
}
exports.BadGatewayError = BadGatewayError;
// 503 Service Unavailable
class ServiceUnavailableError extends CustomError {
    constructor(message, details) {
        super(message, 503, details);
    }
}
exports.ServiceUnavailableError = ServiceUnavailableError;
// 504 Gateway Timeout
class GatewayTimeoutError extends CustomError {
    constructor(message, details) {
        super(message, 504, details);
    }
}
exports.GatewayTimeoutError = GatewayTimeoutError;
// 501 Not Implemented
class NotImplementedError extends CustomError {
    constructor(message, details) {
        super(message, 501, details);
    }
}
exports.NotImplementedError = NotImplementedError;
//# sourceMappingURL=errors.js.map