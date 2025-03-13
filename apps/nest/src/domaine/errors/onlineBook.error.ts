import { HttpException, HttpStatus } from '@nestjs/common';

export class BadRequestException extends HttpException {
  statusCode: number;

  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class ConflictException extends HttpException {
  statusCode: number;

  constructor(message: string) {
    super(message, HttpStatus.CONFLICT);
  }
}

export class NotFoundException extends HttpException {
  statusCode: number;

  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}

export class UnauthorizedException extends HttpException {
  statusCode: number;

  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class InternalServerException extends HttpException {
  statusCode: number;

  constructor(message: string) {
    super(message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class TypeOrmException extends HttpException {
  constructor() {
    super(
      'Problème avec la base de données. Veuillez réessayer plus tard.',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
