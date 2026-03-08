export class ConflictException extends Error {
  constructor(message) {
    super(message, { cause: 409 });
  }
}

export class NotFoundException extends Error {
  constructor(message) {
    super(message, { cause: 404 });
  }
}

export class UnauthorizedException extends Error {
  constructor(message) {
    super(message, { cause: 401 });
  }
}

export class BadRequestException extends Error {
  constructor(message) {
    super(message, { cause: 400 });
  }
}



