interface ErrorResponse {
    statusCode: number;
    body: string;
}

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

// Mapping von Fehlernamen zu aussagekräftigen Log-Meldungen
const errorLabels: Record<string, string> = {
    DatabaseError: 'Datenbankfehler',
    ValidationError: 'Validierungsfehler',
    UnauthorizedError: 'Autorisierungsfehler',
    ForbiddenError: 'Zugriffsfehler',
    NotFoundError: 'Nicht gefunden',
    TooManyRequestsError: 'Zu viele Anfragen',
    UnprocessableEntityError: 'Nicht verarbeitbare Entität',
    InternalServerError: 'Interner Serverfehler',
    BadGatewayError: 'Bad Gateway',
    ServiceUnavailableError: 'Dienst nicht verfügbar',
    GatewayTimeoutError: 'Gateway Timeout',
    NotImplementedError: 'Nicht implementiert',
  };
  
  export function handleError(error: unknown, source?: string): ErrorResponse {
    // Erstelle einen Zusatztext, falls ein Source-Name angegeben wurde.
    const sourceInfo = source ? ` (Quelle: ${source})` : '';
  
    // Wenn der Fehler eine Instanz unserer benutzerdefinierten Fehler ist
    if (error instanceof CustomError) {
      const label = errorLabels[error.name] || 'Fehler';
      console.error(`${label}${sourceInfo}:`, error.message, error.details, error.stack);
      return {
        statusCode: error.statusCode,
        body: JSON.stringify({
          message: error.message,
          details: error.details,
          // Optional: Den Funktionsnamen auch im Response-Body zurückgeben
          source: source
        }),
      };
    } else {
      // Falls der Fehler nicht den erwarteten Typ hat
      console.error(`Unbekannter Fehler${sourceInfo}:`, error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: 'Ein unbekannter Fehler ist aufgetreten.',
          error: String(error),
          source: source
        }),
      };
    }
  }
  